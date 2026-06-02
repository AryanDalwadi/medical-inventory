DROP FUNCTION IF EXISTS sp_getusergrouplist(character varying, integer, integer);

CREATE OR REPLACE FUNCTION sp_GetUserGroupList(
  p_role_name VARCHAR(50) DEFAULT NULL,
  p_page INT DEFAULT 1,
  p_page_size INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  role_name VARCHAR(50),
  status INT,
  sys_admin BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by_name VARCHAR(100),
  updated_by_name VARCHAR(100),
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
    g.id,
    g.role_name,
    g.status,
    g.sys_admin,
    g.created_at,
    g.updated_at,
    uc.user_name AS created_by_name,
    uu.user_name AS updated_by_name,
    COUNT(*) OVER()::BIGINT AS total_count
  FROM user_group g
  LEFT JOIN users uc ON g.created_by = uc.user_id
  LEFT JOIN users uu ON g.updated_by = uu.user_id
  WHERE (
    p_role_name IS NULL
    OR TRIM(p_role_name) = ''
    OR g.role_name ILIKE '%' || TRIM(p_role_name) || '%'
  )
  ORDER BY g.role_name ASC
  LIMIT v_page_size
  OFFSET v_offset;
END;
$$;
