const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getPool } = require('../data_access/dbConnection');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

// GET List of User Groups (with roleName filter and pagination via stored procedure)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const roleName = req.query.roleName || null;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 100;

    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM sp_getusergrouplist($1, $2, $3)',
      [roleName, page, pageSize]
    );

    const rows = result.rows.map((row) => ({
      roleId: row.id,
      roleName: row.role_name,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdByName: row.created_by_name,
      updatedByName: row.updated_by_name,
      totalCount: Number(row.total_count),
    }));

    return successResponse(res, 'User groups fetched successfully', rows);
  } catch (error) {
    return next(error);
  }
});

// POST Create User Group (via stored procedure)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { roleName, status } = req.body;
    if (!roleName || !roleName.trim()) {
      const err = new Error('roleName is required');
      err.statusCode = 400;
      throw err;
    }

    const pool = getPool();
    const result = await pool.query(
      'SELECT sp_insertusergroup($1, $2, $3) AS group_id',
      [roleName.trim(), status !== undefined ? Number(status) : 1, req.user.userId || null]
    );

    return successResponse(res, 'User group created successfully', {
      roleId: result.rows[0].group_id,
      roleName,
      status: status !== undefined ? Number(status) : 1,
    }, 201);
  } catch (error) {
    if (error.message.includes('Role name already exists')) {
      error.statusCode = 409;
    }
    return next(error);
  }
});

// PUT Update User Group (via stored procedure)
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roleName, status } = req.body;

    const pool = getPool();
    await pool.query(
      'SELECT sp_updateusergroup($1, $2, $3, $4)',
      [id, roleName ? roleName.trim() : null, status !== undefined ? Number(status) : null, req.user.userId || null]
    );

    return successResponse(res, 'User group updated successfully', {
      roleId: id,
      roleName,
      status,
    });
  } catch (error) {
    if (error.message.includes('Role name already exists')) {
      error.statusCode = 409;
    }
    if (error.message.includes('User group not found')) {
      error.statusCode = 404;
    }
    return next(error);
  }
});

module.exports = router;
