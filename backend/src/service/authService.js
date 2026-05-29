const bcrypt = require('bcrypt');
const { getPool } = require('../data_access/dbConnection');
const { generateToken } = require('../helper/jwtHelper');

async function login({ userName, password }) {
  const pool = getPool();

  const result = await pool.query(
    'SELECT * FROM sp_getuserbyusername($1)',
    [userName]
  );

  const user = result.rows[0];

  if (!user) {
    const err = new Error('Invalid username or password');
    err.statusCode = 401;
    throw err;
  }

  // Check if user account is deactivated
  if (user.status === 2) {
    const err = new Error('Your account has been deactivated, Please contact to admin.');
    err.statusCode = 403;
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    console.error(`Login failed for user: ${userName}`);
    const err = new Error('Invalid username or password');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({
    userId: user.user_id,
    userName: user.user_name,
    roleId: user.role_id,
  });

  return {
    token,
    user: {
      userId: user.user_id,
      userName: user.user_name,
      roleId: user.role_id,
    },
  };
}

module.exports = { login };
