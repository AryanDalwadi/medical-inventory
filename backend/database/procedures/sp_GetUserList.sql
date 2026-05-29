DROP FUNCTION IF EXISTS sp_getuserlist(character varying, integer, integer);

CREATE OR REPLACE FUNCTION sp_GetUserList(
  p_user_name VARCHAR(100) DEFAULT NULL,
  p_page INT DEFAULT 1,
  p_page_size INT DEFAULT 10
)
RETURNS TABLE (
  user_id INT,
  user_name VARCHAR(100),
  role_id INT,
  role_name VARCHAR(100),
  status INT,
  created_at TIMESTAMP,
  total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_page INT := COALESCE(p_page, 1);
  v_page_size INT := COALESCE(p_page_size, 10);
  v_offset INT;
BEGIN
  IF v_page < 1 THEN
    v_page := 1;
  END IF;

  IF v_page_size < 1 THEN
    v_page_size := 10;
  END IF;

  IF v_page_size > 100 THEN
    v_page_size := 100;
  END IF;

  v_offset := (v_page - 1) * v_page_size;

  RETURN QUERY
  SELECT
    u.user_id,
    u.user_name,
    u.role_id,
    r.role_name,
    u.status,
    u.created_at,
    COUNT(*) OVER()::BIGINT AS total_count
  FROM users u
  LEFT JOIN roles r ON u.role_id = r.role_id
  WHERE (
    p_user_name IS NULL
    OR TRIM(p_user_name) = ''
    OR u.user_name ILIKE '%' || TRIM(p_user_name) || '%'
  )
  ORDER BY u.user_id DESC
  LIMIT v_page_size
  OFFSET v_offset;
END;
$$;
