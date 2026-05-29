INSERT INTO roles (role_name)
VALUES ('Admin'), ('Cashier'), ('Manager')
ON CONFLICT (role_name) DO NOTHING;

-- Seed test users (Password is 'Password123')
-- Uses subselect to dynamically grab role_id
INSERT INTO users (user_name, password_hash, role_id, status)
VALUES 
  ('active_test', '$2b$10$1h4wK4/WSOBO89u18U8FrekzTumvnRSMxVzCQdBJmYzhncvEJpanm', (SELECT role_id FROM roles WHERE role_name = 'Admin'), 1),
  ('deactive_test', '$2b$10$1h4wK4/WSOBO89u18U8FrekzTumvnRSMxVzCQdBJmYzhncvEJpanm', (SELECT role_id FROM roles WHERE role_name = 'Cashier'), 2)
ON CONFLICT (user_name) DO NOTHING;
