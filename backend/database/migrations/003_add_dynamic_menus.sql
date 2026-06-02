DROP TABLE IF EXISTS sub_menu CASCADE;
DROP TABLE IF EXISTS main_menu CASCADE;

CREATE TABLE main_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  priority_id INT DEFAULT 0,
  status INT DEFAULT 1, -- 1 = Active, 2 = In-Active
  expandable BOOLEAN DEFAULT FALSE,
  sys_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE sub_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_menu_id UUID NOT NULL REFERENCES main_menu(id) ON DELETE CASCADE,
  sub_menu_label VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  url VARCHAR(255) NOT NULL,
  sp1_details VARCHAR(255),
  sp2_details VARCHAR(255),
  priority_id INT DEFAULT 0,
  status INT DEFAULT 1, -- 1 = Active, 2 = In-Active
  sys_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(user_id) ON DELETE SET NULL
);

-- Seed dynamic menus
-- Standard Flat Menus
INSERT INTO main_menu (id, label, icon, url, priority_id, status, expandable, sys_admin)
VALUES 
  ('1111bc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dashboard', 'dashboard', '/', 1, 1, FALSE, FALSE),
  ('1111bc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Users & Groups', 'people', '/users-groups', 2, 1, TRUE, FALSE),
  ('1111bc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Products', 'inventory', '/products', 3, 1, FALSE, FALSE),
  ('1111bc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Billing', 'billing', '/billing', 4, 1, FALSE, FALSE),
  ('1111bc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Purchase', 'shopping_cart', '/purchase', 5, 1, FALSE, FALSE),
  ('1111bc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Reports', 'receipt', '/reports', 6, 1, FALSE, FALSE),
  ('1111bc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Menu Settings', 'settings', '/settings/menus', 7, 1, FALSE, TRUE)
ON CONFLICT (label) DO NOTHING;

-- Seed Sub Menus under Users & Groups
INSERT INTO sub_menu (id, main_menu_id, sub_menu_label, icon, url, priority_id, status, sys_admin)
VALUES 
  ('2222bc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1111bc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Users', 'person', '/users', 1, 1, FALSE),
  ('2222bc99-9c0b-4ef8-bb6d-6bb9bd380a12', '1111bc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'User Groups', 'group', '/groups', 2, 1, FALSE)
ON CONFLICT DO NOTHING;
