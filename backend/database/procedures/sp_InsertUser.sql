DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, integer);
DROP FUNCTION IF EXISTS usp_user_create(character varying, character varying, integer);

CREATE OR REPLACE FUNCTION sp_InsertUser(
  p_user_name VARCHAR(100),
  p_password_hash TEXT,
  p_role_id INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id INT;
BEGIN
  IF p_user_name IS NULL OR TRIM(p_user_name) = '' THEN
    RAISE EXCEPTION 'user_name is required';
  END IF;

  IF p_password_hash IS NULL OR TRIM(p_password_hash) = '' THEN
    RAISE EXCEPTION 'password_hash is required';
  END IF;

  IF p_role_id IS NULL THEN
    RAISE EXCEPTION 'role_id is required';
  END IF;

  IF EXISTS (SELECT 1 FROM users WHERE user_name = TRIM(p_user_name)) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM roles WHERE role_id = p_role_id) THEN
    RAISE EXCEPTION 'Invalid role_id';
  END IF;

  INSERT INTO users (user_name, password_hash, role_id)
  VALUES (TRIM(p_user_name), p_password_hash, p_role_id)
  RETURNING user_id INTO v_user_id;

  RETURN v_user_id;
END;
$$;
