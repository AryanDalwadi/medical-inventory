require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runSqlFile(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
  console.log(`Applied: ${path.basename(filePath)}`);
}

async function setupDatabase() {
  const dbName = process.env.DB_NAME || 'medical_inventory';

  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'medical_inventory',
  });

  await adminClient.connect();

  const dbCheck = await adminClient.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );

  if (dbCheck.rowCount === 0) {
    await adminClient.query(`CREATE DATABASE ${dbName}`);
    console.log(`Created database: ${dbName}`);
  } else {
    console.log(`Database already exists: ${dbName}`);
  }

  await adminClient.end();

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: dbName,
  });

  await client.connect();

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  const proceduresDir = path.join(__dirname, '..', 'database', 'procedures');

  await runSqlFile(client, schemaPath);

  if (fs.existsSync(migrationsDir)) {
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      await runSqlFile(client, path.join(migrationsDir, file));
    }
  }

  await runSqlFile(client, seedPath);

  if (fs.existsSync(proceduresDir)) {
    const procedureFiles = fs
      .readdirSync(proceduresDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of procedureFiles) {
      await runSqlFile(client, path.join(proceduresDir, file));
    }
  }

  await client.end();
  console.log('Database setup completed successfully.');
}

setupDatabase().catch((error) => {
  console.error('Database setup failed:', error.message);
  process.exit(1);
});
