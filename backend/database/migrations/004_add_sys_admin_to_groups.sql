ALTER TABLE user_group ADD COLUMN IF NOT EXISTS sys_admin BOOLEAN DEFAULT FALSE;

-- Standard seeded Admin group gets system admin privileges
UPDATE user_group SET sys_admin = TRUE WHERE LOWER(role_name) = 'admin';
