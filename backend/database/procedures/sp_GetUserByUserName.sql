DROP FUNCTION IF EXISTS sp_getuserbyusername(character varying);

CREATE OR REPLACE FUNCTION sp_GetUserByUserName(
  p_user_name VARCHAR(100)
)
RETURNS TABLE (
  user_id INT,
  user_name VARCHAR(100),
  password_hash VARCHAR(255),
  role_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT u.user_id, u.user_name, u.password_hash, u.role_id
  FROM users u
  WHERE u.user_name = TRIM(p_user_name);
END;
$$;
