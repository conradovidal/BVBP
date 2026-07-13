-- Staff access bootstrap: explicit admin allowlist + BVBP domain promotion.

CREATE TABLE public.staff_access_rules (
  email TEXT PRIMARY KEY,
  role public.app_role NOT NULL DEFAULT 'admin',
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT staff_access_rules_email_lower_check CHECK (email = lower(email)),
  CONSTRAINT staff_access_rules_email_format_check CHECK (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
);

CREATE TABLE public.staff_access_domains (
  domain TEXT PRIMARY KEY,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT staff_access_domains_lower_check CHECK (domain = lower(domain)),
  CONSTRAINT staff_access_domains_no_at_check CHECK (position('@' in domain) = 0)
);

INSERT INTO public.staff_access_rules (email, role, display_name)
VALUES
  ('conrado@bvbp.com.br', 'admin', 'Conrado Vidal'),
  ('cristiano@bvbp.com.br', 'admin', 'Cristiano Basso')
ON CONFLICT (email) DO UPDATE
SET
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  updated_at = now();

INSERT INTO public.staff_access_domains (domain, role)
VALUES ('bvbp.com.br', 'admin')
ON CONFLICT (domain) DO UPDATE
SET role = EXCLUDED.role, updated_at = now();

ALTER TABLE public.staff_access_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_access_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "BVBP staff can read staff access rules"
  ON public.staff_access_rules FOR SELECT
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE POLICY "BVBP staff can read staff access domains"
  ON public.staff_access_domains FOR SELECT
  TO authenticated
  USING (public.is_bvbp_staff((select auth.uid())));

CREATE OR REPLACE FUNCTION public.assign_staff_role_from_email(_user_id UUID, _email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email TEXT := lower(trim(coalesce(_email, '')));
  normalized_domain TEXT := split_part(lower(trim(coalesce(_email, ''))), '@', 2);
  resolved_role public.app_role;
BEGIN
  IF _user_id IS NULL OR normalized_email = '' OR position('@' in normalized_email) = 0 THEN
    RETURN;
  END IF;

  SELECT role
  INTO resolved_role
  FROM public.staff_access_rules
  WHERE email = normalized_email;

  IF resolved_role IS NULL THEN
    SELECT role
    INTO resolved_role
    FROM public.staff_access_domains
    WHERE domain = normalized_domain;
  END IF;

  IF resolved_role IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, resolved_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_staff_role_from_email(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_staff_role_from_email(UUID, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.handle_staff_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL THEN
    PERFORM public.assign_staff_role_from_email(NEW.id, NEW.email);
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_staff_role_assignment() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS assign_staff_role_on_auth_user ON auth.users;

CREATE TRIGGER assign_staff_role_on_auth_user
  AFTER INSERT OR UPDATE OF email, email_confirmed_at
  ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_staff_role_assignment();

CREATE OR REPLACE FUNCTION public.handle_client_contact_activation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.client_contacts
    SET
      access_status = 'active',
      disabled_at = NULL,
      updated_at = now()
    WHERE auth_user_id = NEW.id
      AND access_status <> 'disabled';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_client_contact_activation() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS activate_client_contact_on_auth_user ON auth.users;

CREATE TRIGGER activate_client_contact_on_auth_user
  AFTER INSERT OR UPDATE OF email_confirmed_at
  ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_client_contact_activation();

DO $$
DECLARE
  staff_user RECORD;
BEGIN
  FOR staff_user IN
    SELECT id, email
    FROM auth.users
    WHERE email_confirmed_at IS NOT NULL
  LOOP
    PERFORM public.assign_staff_role_from_email(staff_user.id, staff_user.email);
  END LOOP;
END;
$$;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.staff_access_rules TO authenticated;
GRANT SELECT ON public.staff_access_domains TO authenticated;
