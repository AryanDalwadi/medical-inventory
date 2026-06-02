DROP FUNCTION IF EXISTS sp_getdynamicmenuhierarchy();

CREATE OR REPLACE FUNCTION sp_GetDynamicMenuHierarchy()
RETURNS TABLE (
  main_menu_id UUID,
  main_menu_label VARCHAR(100),
  main_menu_icon VARCHAR(100),
  main_menu_url VARCHAR(255),
  main_menu_priority INT,
  main_menu_status INT,
  main_menu_expandable BOOLEAN,
  main_menu_sys_admin BOOLEAN,
  sub_menu_id UUID,
  sub_menu_label VARCHAR(100),
  sub_menu_icon VARCHAR(100),
  sub_menu_url VARCHAR(255),
  sub_menu_sp1 VARCHAR(255),
  sub_menu_sp2 VARCHAR(255),
  sub_menu_priority INT,
  sub_menu_status INT,
  sub_menu_sys_admin BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id AS main_menu_id,
    m.label AS main_menu_label,
    m.icon AS main_menu_icon,
    m.url AS main_menu_url,
    m.priority_id AS main_menu_priority,
    m.status AS main_menu_status,
    m.expandable AS main_menu_expandable,
    m.sys_admin AS main_menu_sys_admin,
    s.id AS sub_menu_id,
    s.sub_menu_label AS sub_menu_label,
    s.icon AS sub_menu_icon,
    s.url AS sub_menu_url,
    s.sp1_details AS sub_menu_sp1,
    s.sp2_details AS sub_menu_sp2,
    s.priority_id AS sub_menu_priority,
    s.status AS sub_menu_status,
    s.sys_admin AS sub_menu_sys_admin
  FROM main_menu m
  LEFT JOIN sub_menu s ON m.id = s.main_menu_id AND s.status = 1
  WHERE m.status = 1
  ORDER BY m.priority_id ASC, s.priority_id ASC;
END;
$$;
