DROP FUNCTION IF EXISTS sp_insertmainmenu(character varying, character varying, character varying, integer, integer, boolean, boolean, uuid);

CREATE OR REPLACE FUNCTION sp_InsertMainMenu(
  p_label VARCHAR(100),
  p_icon VARCHAR(100),
  p_url VARCHAR(255),
  p_priority_id INT DEFAULT 0,
  p_status INT DEFAULT 1,
  p_expandable BOOLEAN DEFAULT FALSE,
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
  IF p_label IS NULL OR TRIM(p_label) = '' THEN
    RAISE EXCEPTION 'label is required';
  END IF;

  IF p_icon IS NULL OR TRIM(p_icon) = '' THEN
    RAISE EXCEPTION 'icon is required';
  END IF;

  IF p_url IS NULL OR TRIM(p_url) = '' THEN
    RAISE EXCEPTION 'url is required';
  END IF;

  -- Validate unique label constraint (case-insensitive)
  IF EXISTS (SELECT 1 FROM main_menu WHERE LOWER(label) = LOWER(TRIM(p_label))) THEN
    RAISE EXCEPTION 'Main menu label already exists';
  END IF;

  -- Validate status
  IF p_status IS NOT NULL AND p_status NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid status. Status must be 1 (Active) or 2 (In-Active)';
  END IF;

  -- Validate created_by user ID exists if provided
  IF p_created_by IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_created_by) THEN
    RAISE EXCEPTION 'Invalid created_by user ID';
  END IF;

  -- Insert main menu
  INSERT INTO main_menu (label, icon, url, priority_id, status, expandable, sys_admin, created_by)
  VALUES (TRIM(p_label), TRIM(p_icon), TRIM(p_url), COALESCE(p_priority_id, 0), COALESCE(p_status, 1), COALESCE(p_expandable, FALSE), COALESCE(p_sys_admin, FALSE), p_created_by)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
