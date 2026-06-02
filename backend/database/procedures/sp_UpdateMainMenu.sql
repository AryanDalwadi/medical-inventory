DROP FUNCTION IF EXISTS sp_updatemainmenu(uuid, character varying, character varying, character varying, integer, integer, boolean, boolean, uuid);

CREATE OR REPLACE FUNCTION sp_UpdateMainMenu(
  p_id UUID,
  p_label VARCHAR(100) DEFAULT NULL,
  p_icon VARCHAR(100) DEFAULT NULL,
  p_url VARCHAR(255) DEFAULT NULL,
  p_priority_id INT DEFAULT NULL,
  p_status INT DEFAULT NULL,
  p_expandable BOOLEAN DEFAULT NULL,
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

  -- Validate menu exists
  IF NOT EXISTS (SELECT 1 FROM main_menu WHERE id = p_id) THEN
    RAISE EXCEPTION 'Main menu not found';
  END IF;

  -- Validate label cannot be empty if provided
  IF p_label IS NOT NULL AND TRIM(p_label) = '' THEN
    RAISE EXCEPTION 'label cannot be empty';
  END IF;

  -- Validate unique label constraint if changed
  IF p_label IS NOT NULL AND EXISTS (
    SELECT 1 FROM main_menu WHERE LOWER(label) = LOWER(TRIM(p_label)) AND id <> p_id
  ) THEN
    RAISE EXCEPTION 'Main menu label already exists';
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
  UPDATE main_menu
  SET
    label = COALESCE(TRIM(p_label), label),
    icon = COALESCE(TRIM(p_icon), icon),
    url = COALESCE(TRIM(p_url), url),
    priority_id = COALESCE(p_priority_id, priority_id),
    status = COALESCE(p_status, status),
    expandable = COALESCE(p_expandable, expandable),
    sys_admin = COALESCE(p_sys_admin, sys_admin),
    updated_at = CURRENT_TIMESTAMP,
    updated_by = p_updated_by
  WHERE id = p_id;

END;
$$;
