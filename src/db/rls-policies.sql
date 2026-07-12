-- AssetFlow AI - Row Level Security (RLS) Policies (Phase 4)

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_department(user_id UUID)
RETURNS UUID AS $$
  SELECT department_id FROM profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
-- Users can view their own profile, admins can view all, users can view others in their department
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view profiles in their department" ON profiles
  FOR SELECT USING (department_id = get_user_department(auth.uid()));

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Departments Policies
-- Everyone can view departments
CREATE POLICY "Everyone can view active departments" ON departments
  FOR SELECT USING (is_active = true OR get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Categories Policies
CREATE POLICY "Everyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Assets Policies
-- Everyone can view assets in their department
CREATE POLICY "Users can view assets in their department" ON assets
  FOR SELECT USING (department_id = get_user_department(auth.uid()));

-- Admins and Asset Managers can view all assets
CREATE POLICY "Admins and Asset Managers can view all assets" ON assets
  FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'asset_manager'));

-- Users can view assets assigned to them
CREATE POLICY "Users can view assigned assets" ON assets
  FOR SELECT USING (current_holder_id = auth.uid());

-- Admins and Asset Managers can manage assets
CREATE POLICY "Admins and Asset Managers can manage assets" ON assets
  FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'asset_manager'));

-- Allocations Policies
CREATE POLICY "Users can view own allocations" ON allocations
  FOR SELECT USING (allocated_to = auth.uid());

CREATE POLICY "Managers and Admins can view all allocations" ON allocations
  FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'asset_manager', 'department_head'));

CREATE POLICY "Asset managers can manage allocations" ON allocations
  FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'asset_manager'));

-- Transfers Policies
CREATE POLICY "Users can view own transfers" ON transfers
  FOR SELECT USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Department heads can view and approve transfers for their dept" ON transfers
  FOR ALL USING (
    get_user_role(auth.uid()) = 'department_head' AND 
    (
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = transfers.from_user_id AND p.department_id = get_user_department(auth.uid()))
      OR
      EXISTS (SELECT 1 FROM profiles p WHERE p.id = transfers.to_user_id AND p.department_id = get_user_department(auth.uid()))
    )
  );

CREATE POLICY "Admins and Asset managers can manage all transfers" ON transfers
  FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'asset_manager'));

-- Maintenance Policies
CREATE POLICY "Users can view own maintenance requests" ON maintenance_requests
  FOR SELECT USING (requested_by = auth.uid());

CREATE POLICY "Users can create maintenance requests" ON maintenance_requests
  FOR INSERT WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Managers can manage all maintenance" ON maintenance_requests
  FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'asset_manager'));

-- Bookings Policies
CREATE POLICY "Users can view all bookings" ON bookings
  FOR SELECT USING (true); -- Public calendar view for resources

CREATE POLICY "Users can manage own bookings" ON bookings
  FOR ALL USING (booked_by = auth.uid());

CREATE POLICY "Managers can manage all bookings" ON bookings
  FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'asset_manager', 'department_head'));

-- Notifications Policies
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Activity Logs Policies
-- All authenticated users can view activity logs for visibility
CREATE POLICY "Users can view all logs" ON activity_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- AI Conversations Policies
CREATE POLICY "Users can manage own AI conversations" ON ai_conversations
  FOR ALL USING (user_id = auth.uid());
