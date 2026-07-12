const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'src');

const directories = [
  'app/(auth)/login',
  'app/(auth)/signup',
  'app/(auth)/forgot-password',
  'app/(auth)/reset-password',
  'app/(dashboard)/dashboard',
  'app/(dashboard)/organization/departments/new',
  'app/(dashboard)/organization/employees/new',
  'app/(dashboard)/organization/categories/new',
  'app/(dashboard)/assets/new',
  'app/(dashboard)/allocations',
  'app/(dashboard)/bookings',
  'app/(dashboard)/maintenance',
  'app/(dashboard)/audits',
  'app/(dashboard)/reports',
  'app/(dashboard)/notifications',
  'app/(dashboard)/activity',
  'app/(dashboard)/settings',
  'app/api',
  'components/ui',
  'components/layout',
  'components/shared',
  'components/icons',
  'lib/supabase',
  'hooks',
  'providers',
  'store',
  'config',
  'types',
  'services'
];

const features = [
  'auth',
  'organization',
  'assets',
  'allocations',
  'bookings',
  'maintenance',
  'audits',
  'reports',
  'notifications',
  'activity',
  'ai'
];

const featureSubdirs = ['components', 'hooks', 'services', 'types', 'actions', 'validators'];

// Create general directories
directories.forEach(dir => {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
});

// Create feature directories and barrel files
features.forEach(feature => {
  featureSubdirs.forEach(subdir => {
    fs.mkdirSync(path.join(root, 'features', feature, subdir), { recursive: true });
  });
  // Create index.ts
  fs.writeFileSync(path.join(root, 'features', feature, 'index.ts'), '// Feature export\n');
});

// Create global types
fs.writeFileSync(path.join(root, 'types', 'database.ts'), '// Database types\n');
fs.writeFileSync(path.join(root, 'types', 'api.ts'), '// API types\n');
fs.writeFileSync(path.join(root, 'types', 'index.ts'), '// Global types export\n');

// Create providers
fs.writeFileSync(path.join(root, 'providers', 'query-provider.tsx'), '// Query Provider\n');
fs.writeFileSync(path.join(root, 'providers', 'theme-provider.tsx'), '// Theme Provider\n');
fs.writeFileSync(path.join(root, 'providers', 'auth-provider.tsx'), '// Auth Provider\n');

// Create db and middleware
fs.mkdirSync(path.join(root, 'db', 'migrations'), { recursive: true });
fs.writeFileSync(path.join(root, 'db', 'schema.sql'), '-- Schema\n');
fs.writeFileSync(path.join(root, 'db', 'seed.sql'), '-- Seed Data\n');
fs.writeFileSync(path.join(root, 'db', 'rls-policies.sql'), '-- RLS Policies\n');

fs.writeFileSync(path.join(root, 'middleware.ts'), '// Next.js Middleware\n');

console.log('Scaffolding complete!');
