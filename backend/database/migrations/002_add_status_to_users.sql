-- Migration to add status field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS status INT DEFAULT 1;
