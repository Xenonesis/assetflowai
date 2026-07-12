"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { departmentSchema, DepartmentValues } from "../validators/org-schemas";
import { createDepartment } from "../actions/department-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function DepartmentForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<DepartmentValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  async function onSubmit(values: DepartmentValues) {
    setError(null);
    const result = await createDepartment(values);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/organization");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">New Department</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Create a new department in the organization.
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
            <Label htmlFor="name" className="text-[var(--text-primary)]">Department Name</Label>
            <Input
              id="name"
              placeholder="e.g. Engineering"
              {...form.register("name")}
              className="border-[var(--border)] focus:ring-[var(--primary)]"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code" className="text-[var(--text-primary)]">Department Code</Label>
            <Input
              id="code"
              placeholder="e.g. ENG"
              {...form.register("code")}
              className="border-[var(--border)] focus:ring-[var(--primary)] uppercase"
            />
            {form.formState.errors.code && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.code.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-[var(--text-primary)]">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="Brief description of the department's function"
            {...form.register("description")}
            className="border-[var(--border)] focus:ring-[var(--primary)]"
          />
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
            {form.formState.isSubmitting ? "Creating..." : "Create Department"}
          </Button>
        </div>
      </form>
    </div>
  );
}
