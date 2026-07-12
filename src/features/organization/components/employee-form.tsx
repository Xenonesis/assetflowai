"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { employeeSchema, EmployeeValues } from "../validators/org-schemas";
import { createEmployee } from "../actions/employee-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function EmployeeForm({ departments = [] }: { departments?: any[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      email: "",
      full_name: "",
      role: "employee",
      department_id: "",
      employee_id: "",
    },
  });

  async function onSubmit(values: EmployeeValues) {
    setError(null);
    const result = await createEmployee(values);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/organization");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Add Employee</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Register a new employee profile in the system.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-[var(--text-primary)]">Full Name</Label>
            <Input
              id="full_name"
              placeholder="e.g. John Doe"
              {...form.register("full_name")}
              className="border-[var(--border)] focus:ring-[var(--primary)]"
            />
            {form.formState.errors.full_name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--text-primary)]">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. john.doe@company.com"
              {...form.register("email")}
              className="border-[var(--border)] focus:ring-[var(--primary)]"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_id" className="text-[var(--text-primary)]">Employee ID</Label>
            <Input
              id="employee_id"
              placeholder="e.g. EMP-102"
              {...form.register("employee_id")}
              className="border-[var(--border)] focus:ring-[var(--primary)] uppercase"
            />
            {form.formState.errors.employee_id && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.employee_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-[var(--text-primary)]">Role</Label>
            <select
              id="role"
              {...form.register("role")}
              className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
            >
              <option value="employee">Employee</option>
              <option value="department_head">Department Head</option>
              <option value="asset_manager">Asset Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="department_id" className="text-[var(--text-primary)]">Department</Label>
            <select
              id="department_id"
              {...form.register("department_id")}
              className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {form.formState.errors.department_id && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.department_id.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--background)]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}
