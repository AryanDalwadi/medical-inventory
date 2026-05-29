DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, integer);
DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, integer, integer);
DROP FUNCTION IF EXISTS usp_user_create(character varying, character varying, integer);

CREATE OR REPLACE FUNCTION sp_InsertUser(
  p_user_name VARCHAR(100),
  p_password_hash TEXT,
  p_role_id INT,
  p_status INT DEFAULT 1
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id INT;
BEGIN
  -- Validate required parameters
  IF p_user_name IS NULL OR TRIM(p_user_name) = '' THEN
    RAISE EXCEPTION 'user_name is required';
  END IF;

  IF p_password_hash IS NULL OR TRIM(p_password_hash) = '' THEN
    RAISE EXCEPTION 'password_hash is required';
  END IF;

  IF p_role_id IS NULL THEN
    RAISE EXCEPTION 'role_id is required';
  END IF;

  -- Validate username unique constraint (case-insensitive)
  IF EXISTS (SELECT 1 FROM users WHERE LOWER(user_name) = LOWER(TRIM(p_user_name))) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  -- Validate role_id exists
  IF NOT EXISTS (SELECT 1 FROM roles WHERE role_id = p_role_id) THEN
    RAISE EXCEPTION 'Invalid role_id';
  END IF;

  -- Validate status is valid (1 = Active, 2 = Deactive)
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (Deactive)';
  END IF;

  -- Insert user with status
  INSERT INTO users (user_name, password_hash, role_id, status)
  VALUES (TRIM(p_user_name), p_password_hash, p_role_id, COALESCE(p_status, 1))
  RETURNING user_id INTO v_user_id;

  RETURN v_user_id;
END;
$$;
