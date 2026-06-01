DROP FUNCTION IF EXISTS sp_insertusergroup(character varying, integer);
DROP FUNCTION IF EXISTS sp_insertusergroup(character varying, integer, uuid);

CREATE OR REPLACE FUNCTION sp_InsertUserGroup(
  p_role_name VARCHAR(50),
  p_status INT DEFAULT 1,
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Validate required parameters
  IF p_role_name IS NULL OR TRIM(p_role_name) = '' THEN
    RAISE EXCEPTION 'role_name is required';
  END IF;

  -- Validate unique role name constraint (case-insensitive)
  IF EXISTS (SELECT 1 FROM user_group WHERE LOWER(role_name) = LOWER(TRIM(p_role_name))) THEN
    RAISE EXCEPTION 'Role name already exists';
  END IF;

  -- Validate status is valid (1 = Active, 2 = Deactive)
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (Deactive)';
  END IF;

  -- Validate created_by exists if provided
  IF p_created_by IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_created_by) THEN
    RAISE EXCEPTION 'Invalid created_by user ID';
  END IF;

  -- Insert user group
  INSERT INTO user_group (role_name, status, created_by)
  VALUES (TRIM(p_role_name), COALESCE(p_status, 1), p_created_by)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
