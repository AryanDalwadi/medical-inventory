DROP FUNCTION IF EXISTS sp_updatesubmenu(uuid, uuid, character varying, character varying, character varying, character varying, character varying, integer, integer, boolean, uuid);

CREATE OR REPLACE FUNCTION sp_UpdateSubMenu(
  p_id UUID,
  p_main_menu_id UUID DEFAULT NULL,
  p_sub_menu_label VARCHAR(100) DEFAULT NULL,
  p_icon VARCHAR(100) DEFAULT NULL,
  p_url VARCHAR(255) DEFAULT NULL,
  p_sp1_details VARCHAR(255) DEFAULT NULL,
  p_sp2_details VARCHAR(255) DEFAULT NULL,
  p_priority_id INT DEFAULT NULL,
  p_status INT DEFAULT NULL,
  p_sys_admin BOOLEAN DEFAULT NULL,
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

  -- Validate sub menu exists
  IF NOT EXISTS (SELECT 1 FROM sub_menu WHERE id = p_id) THEN
    RAISE EXCEPTION 'Sub menu not found';
  END IF;

  -- Validate main_menu_id exists if provided
  IF p_main_menu_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM main_menu WHERE id = p_main_menu_id) THEN
    RAISE EXCEPTION 'Parent main menu not found';
  END IF;

  -- Validate sub_menu_label cannot be empty if provided
  IF p_sub_menu_label IS NOT NULL AND TRIM(p_sub_menu_label) = '' THEN
    RAISE EXCEPTION 'sub_menu_label cannot be empty';
  END IF;

  -- Validate status
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (In-Active)';
  END IF;

  -- Validate updated_by user ID exists if provided
  IF p_updated_by IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_updated_by) THEN
    RAISE EXCEPTION 'Invalid updated_by user ID';
  END IF;

  -- Apply update
  UPDATE sub_menu
  SET
    main_menu_id = COALESCE(p_main_menu_id, main_menu_id),
    sub_menu_label = COALESCE(TRIM(p_sub_menu_label), sub_menu_label),
    icon = COALESCE(TRIM(p_icon), icon),
    url = COALESCE(TRIM(p_url), url),
    sp1_details = COALESCE(TRIM(p_sp1_details), sp1_details),
    sp2_details = COALESCE(TRIM(p_sp2_details), sp2_details),
    priority_id = COALESCE(p_priority_id, priority_id),
    status = COALESCE(p_status, status),
    sys_admin = COALESCE(p_sys_admin, sys_admin),
    updated_at = CURRENT_TIMESTAMP,
    updated_by = p_updated_by
  WHERE id = p_id;

END;
$$;
