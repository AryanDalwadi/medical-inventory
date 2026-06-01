-- Seed user_group roles
INSERT INTO user_group (id, role_name, status)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin', 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Cashier', 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Manager', 1)
ON CONFLICT (role_name) DO NOTHING;

-- Seed test users with UUID keys (Password is 'Password123')
INSERT INTO users (user_id, user_name, full_name, password_hash, role_id, status)
VALUES 
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'active_test', 'Active Test User', '$2b$10$1h4wK4/WSOBO89u18U8FrekzTumvnRSMxVzCQdBJmYzhncvEJpanm', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'deactive_test', 'Deactive Test User', '$2b$10$1h4wK4/WSOBO89u18U8FrekzTumvnRSMxVzCQdBJmYzhncvEJpanm', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 2),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'store_manager', 'Store Manager', '$2b$10$1h4wK4/WSOBO89u18U8FrekzTumvnRSMxVzCQdBJmYzhncvEJpanm', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1)
ON CONFLICT (user_name) DO NOTHING;
