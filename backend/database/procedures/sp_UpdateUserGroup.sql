DROP FUNCTION IF EXISTS sp_updateusergroup(uuid, character varying, integer);
DROP FUNCTION IF EXISTS sp_updateusergroup(uuid, character varying, integer, uuid);

CREATE OR REPLACE FUNCTION sp_UpdateUserGroup(
  p_id UUID,
  p_role_name VARCHAR(50) DEFAULT NULL,
  p_status INT DEFAULT NULL,
  p_updated_by UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate id is provided
  IF p_id IS NULL THEN
    RAISE EXCEPTION 'id is required';
  END IF;

  -- Validate role exists
  IF NOT EXISTS (SELECT 1 FROM user_group WHERE id = p_id) THEN
    RAISE EXCEPTION 'User group not found';
  END IF;

  -- Validate role_name is not empty if provided
  IF p_role_name IS NOT NULL AND TRIM(p_role_name) = '' THEN
    RAISE EXCEPTION 'role_name cannot be empty';
  END IF;

  -- Validate unique role_name if changed (case-insensitive)
  IF p_role_name IS NOT NULL AND EXISTS (
    SELECT 1 FROM user_group WHERE LOWER(role_name) = LOWER(TRIM(p_role_name)) AND id <> p_id
  ) THEN
    RAISE EXCEPTION 'Role name already exists';
  END IF;

  -- Validate status is correct (1 = Active, 2 = Deactive) if provided
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (Deactive)';
  END IF;

  -- Validate updated_by exists if provided
  IF p_updated_by IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_updated_by) THEN
    RAISE EXCEPTION 'Invalid updated_by user ID';
  END IF;

  -- Apply update
  UPDATE user_group
  SET
    role_name = COALESCE(TRIM(p_role_name), role_name),
    status = COALESCE(p_status, status),
    updated_at = CURRENT_TIMESTAMP,
    updated_by = p_updated_by
  WHERE id = p_id;

END;
$$;
