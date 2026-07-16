ALTER TABLE public.client_contacts
  ADD COLUMN title TEXT NOT NULL DEFAULT '',
  ADD COLUMN access_level TEXT NOT NULL DEFAULT 'collaborator';

ALTER TABLE public.client_contacts
  ADD CONSTRAINT client_contacts_access_level_check
  CHECK (access_level IN ('collaborator', 'viewer'));

ALTER TABLE public.client_memberships
  DROP CONSTRAINT client_memberships_role_check;

ALTER TABLE public.client_memberships
  ADD CONSTRAINT client_memberships_role_check
  CHECK (role IN ('client', 'viewer'));

CREATE INDEX client_memberships_contact_id_idx
  ON public.client_memberships (contact_id)
  WHERE contact_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.has_collaborative_client_membership(_workspace_id TEXT, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.client_memberships memberships
    WHERE memberships.workspace_id = _workspace_id
      AND memberships.user_id = _user_id
      AND memberships.status = 'active'
      AND memberships.role = 'client'
  )
$$;

DROP POLICY "Clients can update collaborative client payloads"
  ON public.client_workspace_payloads;

CREATE POLICY "Collaborative clients can update client payloads"
  ON public.client_workspace_payloads FOR UPDATE
  TO authenticated
  USING (
    payload_key IN ('pdca_cycles', 'initiative_activities')
    AND public.has_collaborative_client_membership(workspace_id, (select auth.uid()))
  )
  WITH CHECK (
    payload_key IN ('pdca_cycles', 'initiative_activities')
    AND public.has_collaborative_client_membership(workspace_id, (select auth.uid()))
  );

REVOKE ALL ON FUNCTION public.has_collaborative_client_membership(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_collaborative_client_membership(TEXT, UUID) TO authenticated;
