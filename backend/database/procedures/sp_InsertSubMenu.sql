DROP FUNCTION IF EXISTS sp_insertsubmenu(uuid, character varying, character varying, character varying, character varying, character varying, integer, integer, boolean, uuid);

CREATE OR REPLACE FUNCTION sp_InsertSubMenu(
  p_main_menu_id UUID,
  p_sub_menu_label VARCHAR(100),
  p_icon VARCHAR(100),
  p_url VARCHAR(255),
  p_sp1_details VARCHAR(255) DEFAULT NULL,
  p_sp2_details VARCHAR(255) DEFAULT NULL,
  p_priority_id INT DEFAULT 0,
  p_status INT DEFAULT 1,
  p_sys_admin BOOLEAN DEFAULT FALSE,
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Validate required parameters
  IF p_main_menu_id IS NULL THEN
    RAISE EXCEPTION 'main_menu_id is required';
  END IF;

  IF p_sub_menu_label IS NULL OR TRIM(p_sub_menu_label) = '' THEN
    RAISE EXCEPTION 'sub_menu_label is required';
  END IF;

  IF p_url IS NULL OR TRIM(p_url) = '' THEN
    RAISE EXCEPTION 'url is required';
  END IF;

  -- Validate main_menu_id exists
  IF NOT EXISTS (SELECT 1 FROM main_menu WHERE id = p_main_menu_id) THEN
    RAISE EXCEPTION 'Parent main menu not found';
  END IF;

  -- Validate status
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (In-Active)';
  END IF;

  -- Validate created_by user ID exists if provided
  IF p_created_by IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_created_by) THEN
    RAISE EXCEPTION 'Invalid created_by user ID';
  END IF;

  -- Insert sub menu
  INSERT INTO sub_menu (
    main_menu_id,
    sub_menu_label,
    icon,
    url,
    sp1_details,
    sp2_details,
    priority_id,
    status,
    sys_admin,
    created_by
  )
  VALUES (
    p_main_menu_id,
    TRIM(p_sub_menu_label),
    TRIM(p_icon),
    TRIM(p_url),
    TRIM(p_sp1_details),
    TRIM(p_sp2_details),
    COALESCE(p_priority_id, 0),
    COALESCE(p_status, 1),
    COALESCE(p_sys_admin, FALSE),
    p_created_by
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
