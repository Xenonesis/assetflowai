-- AssetFlow AI - Seed Data Migration

-- 1. Departments
INSERT INTO departments (id, name, code, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Information Technology', 'IT', 'IT Infrastructure and Support'),
('22222222-2222-2222-2222-222222222222', 'Human Resources', 'HR', 'HR and Talent Acquisition'),
('33333333-3333-3333-3333-333333333333', 'Engineering', 'ENG', 'Product Engineering')
ON CONFLICT (name) DO NOTHING;

-- 2. Profiles (Assuming Auth trigger creates these, but simulating here)
INSERT INTO profiles (id, email, full_name, role, department_id, employee_id) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@assetflow.ai', 'System Admin', 'admin', '11111111-1111-1111-1111-111111111111', 'EMP-001'),
('00000000-0000-0000-0000-000000000002', 'manager@assetflow.ai', 'Asset Manager', 'asset_manager', '11111111-1111-1111-1111-111111111111', 'EMP-002'),
('00000000-0000-0000-0000-000000000003', 'head@assetflow.ai', 'Engineering Head', 'department_head', '33333333-3333-3333-3333-333333333333', 'EMP-003'),
('00000000-0000-0000-0000-000000000004', 'employee@assetflow.ai', 'Jane Doe', 'employee', '33333333-3333-3333-3333-333333333333', 'EMP-004')
ON CONFLICT (email) DO NOTHING;

-- 3. Categories
INSERT INTO categories (id, name, description, icon) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Laptops', 'Portable computers', 'laptop'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Monitors', 'External displays', 'monitor'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mobile Devices', 'Phones and tablets', 'smartphone'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Furniture', 'Desks, chairs, etc.', 'armchair')
ON CONFLICT (name) DO NOTHING;

-- 4. Assets
INSERT INTO assets (id, asset_tag, name, serial_number, category_id, department_id, status, current_holder_id, purchase_cost) VALUES
('12345678-1234-1234-1234-123456789012', 'AF-LT-001', 'MacBook Pro 16" M3 Max', 'C02XXXXXXX1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'allocated', '00000000-0000-0000-0000-000000000004', 3499.00),
('23456789-2345-2345-2345-234567890123', 'AF-LT-002', 'Dell XPS 15', 'DPX-0012', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'available', NULL, 1899.00),
('34567890-3456-3456-3456-345678901234', 'AF-MN-001', 'LG UltraFine 5K', 'LG-5K-001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'allocated', '00000000-0000-0000-0000-000000000003', 1299.00),
('45678901-4567-4567-4567-456789012345', 'AF-MB-001', 'iPhone 15 Pro', 'IP15-001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'maintenance', NULL, 999.00)
ON CONFLICT (asset_tag) DO NOTHING;

-- 5. Allocations
INSERT INTO allocations (asset_id, allocated_to, allocated_by, expected_return) VALUES
('12345678-1234-1234-1234-123456789012', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '2027-07-01'),
('34567890-3456-3456-3456-345678901234', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '2028-01-01')
ON CONFLICT (id) DO NOTHING;

-- 6. Maintenance Requests
INSERT INTO maintenance_requests (asset_id, requested_by, description, priority, status) VALUES
('45678901-4567-4567-4567-456789012345', '00000000-0000-0000-0000-000000000004', 'Screen cracked, needs replacement', 'high', 'approved')
ON CONFLICT (id) DO NOTHING;
