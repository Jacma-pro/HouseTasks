-- =============================================
-- HouseTasks - Database Schema COMPLET
-- PostgreSQL (Supabase)
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (lié à auth.users Supabase)
-- =============================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- FAMILIES
-- =============================================
CREATE TABLE families (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- FAMILY MEMBERS
-- =============================================
CREATE TABLE family_members (
  family_id  UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (family_id, user_id)
);

-- =============================================
-- INVITATIONS
-- =============================================
CREATE TABLE invitations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id  UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL REFERENCES profiles(id),
  accepted   BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- =============================================
-- TASKS
-- =============================================
CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id    UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority     TEXT CHECK (priority IN ('low', 'medium', 'high')),
  due_date     TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- TASK ASSIGNMENTS (qui est assigné)
-- =============================================
CREATE TABLE task_assignments (
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);

-- =============================================
-- TASK DEPENDENCIES (qui doit aider)
-- =============================================
CREATE TABLE task_dependencies (
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);

-- =============================================
-- AVAILABILITY (créneaux d'indisponibilité)
-- =============================================
CREATE TABLE availability (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  family_id     UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  day_of_week   SMALLINT CHECK (day_of_week BETWEEN 0 AND 6),
  specific_date DATE,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  reason        TEXT,
  is_recurring  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT availability_type_check CHECK (
    (is_recurring = true  AND day_of_week IS NOT NULL AND specific_date IS NULL) OR
    (is_recurring = false AND specific_date IS NOT NULL AND day_of_week IS NULL)
  )
);

-- =============================================
-- TASK HISTORY (audit)
-- =============================================
CREATE TABLE task_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  changed_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL
                CHECK (action IN ('created', 'assigned', 'status_changed', 'updated', 'deleted')),
  old_value   JSONB,
  new_value   JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_family_members_user    ON family_members(user_id);
CREATE INDEX idx_family_members_family  ON family_members(family_id);
CREATE INDEX idx_invitations_token      ON invitations(token);
CREATE INDEX idx_invitations_email      ON invitations(email);
CREATE INDEX idx_tasks_family           ON tasks(family_id);
CREATE INDEX idx_tasks_created_by       ON tasks(created_by);
CREATE INDEX idx_tasks_status           ON tasks(status);
CREATE INDEX idx_tasks_due_date         ON tasks(due_date);
CREATE INDEX idx_task_assignments_user  ON task_assignments(user_id);
CREATE INDEX idx_task_dependencies_user ON task_dependencies(user_id);
CREATE INDEX idx_availability_user      ON availability(user_id);
CREATE INDEX idx_availability_family    ON availability(family_id);
CREATE INDEX idx_task_history_task      ON task_history(task_id);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE families          ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability      ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history      ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_read_all"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Families : visible uniquement par les membres
CREATE POLICY "families_read_members" ON families FOR SELECT
  USING (id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid()));
CREATE POLICY "families_insert" ON families FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "families_update_admin" ON families FOR UPDATE
  USING (id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Family members
CREATE POLICY "family_members_read" ON family_members FOR SELECT
  USING (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid()));
CREATE POLICY "family_members_insert_admin" ON family_members FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "family_members_delete_admin" ON family_members FOR DELETE
  USING (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Invitations
CREATE POLICY "invitations_read" ON invitations FOR SELECT
  USING (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid()));
CREATE POLICY "invitations_insert_admin" ON invitations FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Tasks
CREATE POLICY "tasks_read_family" ON tasks FOR SELECT
  USING (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid()));
CREATE POLICY "tasks_insert" ON tasks FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid()));
CREATE POLICY "tasks_update_own" ON tasks FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "tasks_delete_own" ON tasks FOR DELETE USING (auth.uid() = created_by);

-- Task assignments & dependencies
CREATE POLICY "task_assignments_read" ON task_assignments FOR SELECT
  USING (task_id IN (SELECT id FROM tasks WHERE family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid())));
CREATE POLICY "task_assignments_write" ON task_assignments FOR ALL
  USING (task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid()));

CREATE POLICY "task_dependencies_read" ON task_dependencies FOR SELECT
  USING (task_id IN (SELECT id FROM tasks WHERE family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid())));
CREATE POLICY "task_dependencies_write" ON task_dependencies FOR ALL
  USING (task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid()));

-- Availability
CREATE POLICY "availability_read_family" ON availability FOR SELECT
  USING (family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid()));
CREATE POLICY "availability_own" ON availability FOR ALL USING (auth.uid() = user_id);

-- Task history
CREATE POLICY "task_history_read" ON task_history FOR SELECT
  USING (task_id IN (SELECT id FROM tasks WHERE family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid())));