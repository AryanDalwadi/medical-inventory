CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_group CASCADE;

CREATE TABLE IF NOT EXISTS user_group (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR(50) NOT NULL UNIQUE,
  status INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role_id UUID,
  status INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Add columns dynamically if tables already existed without them
ALTER TABLE user_group ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE user_group ADD COLUMN IF NOT EXISTS updated_by UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_by UUID;

-- Add foreign key constraints to resolve circular references
ALTER TABLE user_group DROP CONSTRAINT IF EXISTS fk_user_group_created_by;
ALTER TABLE user_group DROP CONSTRAINT IF EXISTS fk_user_group_updated_by;
ALTER TABLE user_group ADD CONSTRAINT fk_user_group_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL;
ALTER TABLE user_group ADD CONSTRAINT fk_user_group_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_role_id;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_created_by;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_updated_by;
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES user_group(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS products (
  product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  barcode VARCHAR(100),
  gst_percentage DECIMAL(5, 2) DEFAULT 0,
  category_id INT,
  manufacturer_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_batches (
  batch_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(product_id),
  batch_number VARCHAR(100) NOT NULL,
  expiry_date DATE,
  purchase_price DECIMAL(10, 2) DEFAULT 0,
  selling_price DECIMAL(10, 2) DEFAULT 0,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_invoices (
  invoice_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id INT,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  gst_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
