-- Client portal access bridge: Auth memberships + JSONB payloads.

CREATE TABLE public.client_workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  segment TEXT NOT NULL,
  relationship_status TEXT NOT NULL DEFAULT 'Onboarding',
  company_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.client_contacts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.client_workspaces(id) ON DELETE CASCADE,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  access_status TEXT NOT NULL DEFAULT 'planned',
  invited_at TIMESTAMPTZ,
  disabled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT client_contacts_access_status_check
    CHECK (access_status IN ('planned', 'invited', 'active', 'disabled')),
  CONSTRAINT client_contacts_email_check
    CHECK (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
);

CREATE UNIQUE INDEX client_contacts_workspace_email_idx
  ON public.client_contacts (workspace_id, lower(email));

CREATE UNIQUE INDEX client_contacts_one_primary_idx
  ON public.client_contacts (workspace_id)
  WHERE is_primary;

CREATE TABLE public.client_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL REFERENCES public.client_workspaces(id) ON DELETE CASCADE,
  contact_id TEXT REFERENCES public.client_contacts(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT client_memberships_role_check CHECK (role = 'client'),
  CONSTRAINT client_memberships_status_check CHECK (status IN ('active', 'disabled'))
);

CREATE UNIQUE INDEX client_memberships_workspace_user_idx
  ON public.client_memberships (workspace_id, user_id);

CREATE TABLE public.client_workspace_payloads (
  workspace_id TEXT NOT NULL REFERENCES public.client_workspaces(id) ON DELETE CASCADE,
  payload_key TEXT NOT NULL,
  schema_version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  PRIMARY KEY (workspace_id, payload_key),
  CONSTRAINT client_workspace_payloads_key_check
    CHECK (payload_key IN ('client_configuration', 'pdca_cycles', 'initiative_activities'))
);

ALTER TABLE public.client_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_workspace_payloads ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_bvbp_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'editor')
$$;

CREATE OR REPLACE FUNCTION public.has_active_client_membership(_workspace_id TEXT, _user_id UUID)
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
  )
$$;

CREATE POLICY "BVBP staff can read client workspaces"
  ON public.client_workspaces FOR SELECT
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "Clients can read own workspaces"
  ON public.client_workspaces FOR SELECT
  TO authenticated
  USING (public.has_active_client_membership(id, (select auth.uid())));

CREATE POLICY "BVBP staff can create client workspaces"
  ON public.client_workspaces FOR INSERT
  TO authenticated
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can update client workspaces"
  ON public.client_workspaces FOR UPDATE
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())))
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can delete client workspaces"
  ON public.client_workspaces FOR DELETE
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can read client contacts"
  ON public.client_contacts FOR SELECT
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "Clients can read own workspace contacts"
  ON public.client_contacts FOR SELECT
  TO authenticated
  USING (public.has_active_client_membership(workspace_id, (select auth.uid())));

CREATE POLICY "BVBP staff can create client contacts"
  ON public.client_contacts FOR INSERT
  TO authenticated
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can update client contacts"
  ON public.client_contacts FOR UPDATE
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())))
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can delete client contacts"
  ON public.client_contacts FOR DELETE
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can read client memberships"
  ON public.client_memberships FOR SELECT
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "Clients can read own client memberships"
  ON public.client_memberships FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()) AND status = 'active');

CREATE POLICY "BVBP staff can create client memberships"
  ON public.client_memberships FOR INSERT
  TO authenticated
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can update client memberships"
  ON public.client_memberships FOR UPDATE
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())))
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can delete client memberships"
  ON public.client_memberships FOR DELETE
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can read client payloads"
  ON public.client_workspace_payloads FOR SELECT
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "Clients can read own client payloads"
  ON public.client_workspace_payloads FOR SELECT
  TO authenticated
  USING (public.has_active_client_membership(workspace_id, (select auth.uid())));

CREATE POLICY "BVBP staff can create client payloads"
  ON public.client_workspace_payloads FOR INSERT
  TO authenticated
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can update client payloads"
  ON public.client_workspace_payloads FOR UPDATE
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())))
  WITH CHECK (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "Clients can update collaborative client payloads"
  ON public.client_workspace_payloads FOR UPDATE
  TO authenticated
  USING (
    payload_key IN ('pdca_cycles', 'initiative_activities')
    AND public.has_active_client_membership(workspace_id, (select auth.uid()))
  )
  WITH CHECK (
    payload_key IN ('pdca_cycles', 'initiative_activities')
    AND public.has_active_client_membership(workspace_id, (select auth.uid()))
  );

GRANT EXECUTE ON FUNCTION public.is_bvbp_staff(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_client_membership(TEXT, UUID) TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_workspaces TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_contacts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_memberships TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.client_workspace_payloads TO authenticated;
