import { getDepartments } from "@/features/organization/actions/department-actions";
import Link from "next/link";
import { Plus, Users, Building2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrganizationPage() {
  const departments = await getDepartments();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Organization Settings</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage departments, employees, and categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Departments</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] flex-1 mb-6">
            Configure the structural hierarchy of your organization.
          </p>
          <Link href="/organization/departments/new" className="w-full">
            <Button variant="outline" className="w-full border-[var(--border)] hover:bg-[var(--background)]">
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </Link>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Employees</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] flex-1 mb-6">
            Manage user profiles, roles, and department assignments.
          </p>
          <Link href="/organization/employees/new" className="w-full">
            <Button variant="outline" className="w-full border-[var(--border)] hover:bg-[var(--background)]">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Categories</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] flex-1 mb-6">
            Define asset classification types and metadata schemas.
          </p>
          <Link href="/organization/categories/new" className="w-full">
            <Button variant="outline" className="w-full border-[var(--border)] hover:bg-[var(--background)]">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]">
          <h3 className="font-medium text-[var(--text-primary)]">Departments Overview</h3>
        </div>
        {departments && departments.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {departments.map((dept) => (
              <Link 
                key={dept.id} 
                href={`/organization/departments/${dept.id}`}
                className="px-6 py-4 flex items-center justify-between hover:bg-[var(--background)] transition-colors block"
              >
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{dept.name}</p>
                  <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">{dept.code}</p>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {/* Assuming dept.head exists if joined */}
                  Head: {dept.head ? (dept.head as any).full_name : "Unassigned"}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-[var(--text-secondary)]">
            No departments found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
