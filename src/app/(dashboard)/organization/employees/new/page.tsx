import { EmployeeForm } from "@/features/organization/components/employee-form";
import { getDepartments } from "@/features/organization/actions/department-actions";

export default async function NewEmployeePage() {
  const departments = await getDepartments();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Organization</span>
        <span>/</span>
        <span>Employees</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New</span>
      </div>

      <EmployeeForm departments={departments || []} />
    </div>
  );
}
