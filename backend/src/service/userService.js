const bcrypt = require('bcrypt');
const { getPool } = require('../data_access/dbConnection');

async function createUser({ userName, password, roleId, status }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const pool = getPool();

  try {
    const result = await pool.query(
      'SELECT sp_insertuser($1, $2, $3, $4) AS user_id',
      [userName, passwordHash, roleId, status !== undefined ? status : 1]
    );

    return {
      userId: result.rows[0].user_id,
      userName,
      roleId,
      status: status !== undefined ? status : 1
    };
  } catch (error) {
    if (error.message.includes('Username already exists')) {
      const err = new Error('Username already exists');
      err.statusCode = 409;
      throw err;
    }

    if (error.message.includes('Invalid role_id')) {
      const err = new Error('Invalid role_id');
      err.statusCode = 400;
      throw err;
    }

    throw error;
  }
}

async function getUsers({ userName, page, pageSize }) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT * FROM sp_getuserlist($1, $2, $3)',
    [userName || null, page, pageSize]
  );

  const rows = result.rows;
  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

  const items = rows.map((row) => ({
    userId: row.user_id,
    userName: row.user_name,
    roleId: row.role_id,
    roleName: row.role_name,
    status: row.status,
    createdAt: row.created_at,
  }));

  return {
    items,
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  };
}

async function updateUser(userId, { userName, password, roleId, status }) {
  const pool = getPool();
  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  try {
    await pool.query(
      'SELECT sp_updateuser($1, $2, $3, $4, $5)',
      [userId, userName || null, passwordHash || null, roleId || null, status || null]
    );

    return {
      userId,
      userName,
      roleId,
      status
    };
  } catch (error) {
    if (error.message.includes('Username already exists')) {
      const err = new Error('Username already exists');
      err.statusCode = 409;
      throw err;
    }

    if (error.message.includes('Invalid role_id')) {
      const err = new Error('Invalid role_id');
      err.statusCode = 400;
      throw err;
    }

    if (error.message.includes('User not found')) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    throw error;
  }
}

module.exports = { createUser, getUsers, updateUser };
