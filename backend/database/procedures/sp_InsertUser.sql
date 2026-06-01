DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, integer);
DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, integer, integer);
DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, uuid);
DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, uuid, integer);
DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, uuid, integer, uuid);
DROP FUNCTION IF EXISTS sp_insertuser(character varying, text, uuid, integer, character varying, uuid);

CREATE OR REPLACE FUNCTION sp_InsertUser(
  p_user_name VARCHAR(100),
  p_password_hash TEXT,
  p_role_id UUID,
  p_status INT DEFAULT 1,
  p_full_name VARCHAR(100) DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Validate required parameters
  IF p_user_name IS NULL OR TRIM(p_user_name) = '' THEN
    RAISE EXCEPTION 'user_name is required';
  END IF;

  -- Validate unique username constraint (case-insensitive)
  IF EXISTS (SELECT 1 FROM users WHERE LOWER(user_name) = LOWER(TRIM(p_user_name))) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  -- Validate role_id exists
  IF NOT EXISTS (SELECT 1 FROM user_group WHERE id = p_role_id) THEN
    RAISE EXCEPTION 'Invalid role_id';
  END IF;

  -- Validate status is valid (1 = Active, 2 = Deactive)
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (Deactive)';
  END IF;

  -- Validate created_by exists if provided
  IF p_created_by IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_created_by) THEN
    RAISE EXCEPTION 'Invalid created_by user ID';
  END IF;

  -- Insert user with status, creator, and full name
  INSERT INTO users (user_name, full_name, password_hash, role_id, status, created_by)
  VALUES (TRIM(p_user_name), TRIM(p_full_name), p_password_hash, p_role_id, COALESCE(p_status, 1), p_created_by)
  RETURNING user_id INTO v_user_id;

  RETURN v_user_id;
END;
$$;
