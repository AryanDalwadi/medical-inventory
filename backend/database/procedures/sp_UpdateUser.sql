DROP FUNCTION IF EXISTS sp_updateuser(integer, character varying, text, integer, integer);

CREATE OR REPLACE FUNCTION sp_UpdateUser(
  p_user_id INT,
  p_user_name VARCHAR(100) DEFAULT NULL,
  p_password_hash TEXT DEFAULT NULL,
  p_role_id INT DEFAULT NULL,
  p_status INT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate user_id is provided
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id is required';
  END IF;

  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Validate user_name is not empty if provided
  IF p_user_name IS NOT NULL AND TRIM(p_user_name) = '' THEN
    RAISE EXCEPTION 'user_name cannot be empty';
  END IF;

  -- Validate unique username if changed (case-insensitive)
  IF p_user_name IS NOT NULL AND EXISTS (
    SELECT 1 FROM users WHERE LOWER(user_name) = LOWER(TRIM(p_user_name)) AND user_id <> p_user_id
  ) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  -- Validate role_id exists if provided
  IF p_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM roles WHERE role_id = p_role_id) THEN
    RAISE EXCEPTION 'Invalid role_id';
  END IF;

  -- Validate status is correct (1 = Active, 2 = Deactive) if provided
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (Deactive)';
  END IF;

  -- Apply update
  UPDATE users
  SET
    user_name = COALESCE(TRIM(p_user_name), user_name),
    password_hash = COALESCE(p_password_hash, password_hash),
    role_id = COALESCE(p_role_id, role_id),
    status = COALESCE(p_status, status)
  WHERE user_id = p_user_id;

END;
$$;
