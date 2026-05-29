const { pool } = require('../config/db');

function getPool() {
  return pool;
}

async function testConnection() {
  try {
    await pool.query('SELECT 1 AS connected');
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

module.exports = { getPool, testConnection };
