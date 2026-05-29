INSERT INTO roles (role_name)
VALUES ('Admin'), ('Cashier'), ('Manager')
ON CONFLICT (role_name) DO NOTHING;
