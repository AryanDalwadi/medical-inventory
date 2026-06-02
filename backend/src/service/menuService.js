const { getPool } = require('../data_access/dbConnection');

async function checkIsAdmin(roleId) {
  if (!roleId) return false;
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT sys_admin FROM user_group WHERE id = $1',
      [roleId]
    );
    if (result.rows.length > 0) {
      return !!result.rows[0].sys_admin;
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
  }
  return false;
}

async function getMenuHierarchy(roleId) {
  const pool = getPool();
  const isAdmin = await checkIsAdmin(roleId);

  // Fetch using the compiled stored procedure
  const result = await pool.query('SELECT * FROM sp_GetDynamicMenuHierarchy()');
  const rows = result.rows;

  // Group items by main menu
  const menuMap = new Map();

  for (const row of rows) {
    // If the main menu is sys_admin and current user is not admin, filter it out
    if (row.main_menu_sys_admin && !isAdmin) {
      continue;
    }

    if (!menuMap.has(row.main_menu_id)) {
      menuMap.set(row.main_menu_id, {
        id: row.main_menu_id,
        label: row.main_menu_label,
        icon: row.main_menu_icon,
        url: row.main_menu_url,
        priorityId: row.main_menu_priority,
        status: row.main_menu_status,
        expandable: row.main_menu_expandable,
        sysAdmin: row.main_menu_sys_admin,
        subMenus: [],
      });
    }

    // Add sub menu if it exists and is active, and is accessible
    if (row.sub_menu_id) {
      if (row.sub_menu_sys_admin && !isAdmin) {
        continue;
      }

      const mainMenuItem = menuMap.get(row.main_menu_id);
      mainMenuItem.subMenus.push({
        id: row.sub_menu_id,
        mainMenuId: row.main_menu_id,
        label: row.sub_menu_label,
        icon: row.sub_menu_icon,
        url: row.sub_menu_url,
        sp1Details: row.sub_menu_sp1,
        sp2Details: row.sub_menu_sp2,
        priorityId: row.sub_menu_priority,
        status: row.sub_menu_status,
        sysAdmin: row.sub_menu_sys_admin,
      });
    }
  }

  // Convert map to array and sort by priority_id
  const hierarchy = Array.from(menuMap.values());
  // Sort main menus
  hierarchy.sort((a, b) => a.priorityId - b.priorityId);

  // Sort sub menus inside each main menu
  for (const menu of hierarchy) {
    menu.subMenus.sort((a, b) => a.priorityId - b.priorityId);
  }

  return hierarchy;
}

async function getAllMainMenus() {
  const pool = getPool();
  // Fetch all main menus ordered by priority
  const result = await pool.query(
    'SELECT id, label, icon, url, priority_id AS "priorityId", status, expandable, sys_admin AS "sysAdmin", created_at AS "createdAt", updated_at AS "updatedAt" FROM main_menu ORDER BY priority_id ASC'
  );
  return result.rows;
}

async function getAllSubMenus() {
  const pool = getPool();
  // Fetch all sub menus with parent menu labels joined for the administrative grid view
  const result = await pool.query(
    `SELECT s.id, s.main_menu_id AS "mainMenuId", m.label AS "mainMenuLabel", 
            s.sub_menu_label AS "label", s.icon, s.url, s.sp1_details AS "sp1Details", 
            s.sp2_details AS "sp2Details", s.priority_id AS "priorityId", s.status, 
            s.sys_admin AS "sysAdmin", s.created_at AS "createdAt", s.updated_at AS "updatedAt"
     FROM sub_menu s
     JOIN main_menu m ON s.main_menu_id = m.id
     ORDER BY m.priority_id ASC, s.priority_id ASC`
  );
  return result.rows;
}

async function createMainMenu({ label, icon, url, priority_id, status, expandable, sys_admin, createdBy }) {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT sp_insertmainmenu($1, $2, $3, $4, $5, $6, $7, $8) AS main_menu_id',
      [label, icon, url, priority_id !== undefined ? priority_id : 0, status !== undefined ? status : 1, expandable || false, sys_admin || false, createdBy || null]
    );
    return {
      id: result.rows[0].main_menu_id,
      label,
      icon,
      url,
      priorityId: priority_id,
      status,
      expandable,
      sysAdmin: sys_admin,
    };
  } catch (error) {
    if (error.message.includes('Main menu label already exists')) {
      const err = new Error('Main menu label already exists');
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
}

async function updateMainMenu(id, { label, icon, url, priority_id, status, expandable, sys_admin, updatedBy }) {
  const pool = getPool();
  try {
    await pool.query(
      'SELECT sp_updatemainmenu($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        id,
        label !== undefined ? label : null,
        icon !== undefined ? icon : null,
        url !== undefined ? url : null,
        priority_id !== undefined ? priority_id : null,
        status !== undefined ? status : null,
        expandable !== undefined ? expandable : null,
        sys_admin !== undefined ? sys_admin : null,
        updatedBy || null,
      ]
    );
    return {
      id,
      label,
      icon,
      url,
      priorityId: priority_id,
      status,
      expandable,
      sysAdmin: sys_admin,
    };
  } catch (error) {
    if (error.message.includes('Main menu label already exists')) {
      const err = new Error('Main menu label already exists');
      err.statusCode = 409;
      throw err;
    }
    if (error.message.includes('Main menu not found')) {
      const err = new Error('Main menu not found');
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
}

async function createSubMenu({ main_menu_id, sub_menu_label, icon, url, sp1_details, sp2_details, priority_id, status, sys_admin, createdBy }) {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT sp_insertsubmenu($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) AS sub_menu_id',
      [
        main_menu_id,
        sub_menu_label,
        icon,
        url,
        sp1_details || null,
        sp2_details || null,
        priority_id !== undefined ? priority_id : 0,
        status !== undefined ? status : 1,
        sys_admin || false,
        createdBy || null,
      ]
    );
    return {
      id: result.rows[0].sub_menu_id,
      mainMenuId: main_menu_id,
      label: sub_menu_label,
      icon,
      url,
      sp1Details: sp1_details,
      sp2Details: sp2_details,
      priorityId: priority_id,
      status,
      sysAdmin: sys_admin,
    };
  } catch (error) {
    if (error.message.includes('Parent main menu not found')) {
      const err = new Error('Parent main menu not found');
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
}

async function updateSubMenu(id, { main_menu_id, sub_menu_label, icon, url, sp1_details, sp2_details, priority_id, status, sys_admin, updatedBy }) {
  const pool = getPool();
  try {
    await pool.query(
      'SELECT sp_updatesubmenu($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        id,
        main_menu_id !== undefined ? main_menu_id : null,
        sub_menu_label !== undefined ? sub_menu_label : null,
        icon !== undefined ? icon : null,
        url !== undefined ? url : null,
        sp1_details !== undefined ? sp1_details : null,
        sp2_details !== undefined ? sp2_details : null,
        priority_id !== undefined ? priority_id : null,
        status !== undefined ? status : null,
        sys_admin !== undefined ? sys_admin : null,
        updatedBy || null,
      ]
    );
    return {
      id,
      mainMenuId: main_menu_id,
      label: sub_menu_label,
      icon,
      url,
      sp1Details: sp1_details,
      sp2Details: sp2_details,
      priorityId: priority_id,
      status,
      sysAdmin: sys_admin,
    };
  } catch (error) {
    if (error.message.includes('Parent main menu not found')) {
      const err = new Error('Parent main menu not found');
      err.statusCode = 400;
      throw err;
    }
    if (error.message.includes('Sub menu not found')) {
      const err = new Error('Sub menu not found');
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
}

module.exports = {
  checkIsAdmin,
  getMenuHierarchy,
  getAllMainMenus,
  getAllSubMenus,
  createMainMenu,
  updateMainMenu,
  createSubMenu,
  updateSubMenu,
};
