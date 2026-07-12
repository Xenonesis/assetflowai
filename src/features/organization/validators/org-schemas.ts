import { z } from "zod";

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  code: z.string().min(2, "Department code is required"),
  description: z.string().optional(),
  head_id: z.string().regex(uuidRegex, "Invalid employee ID").or(z.literal("")).optional().nullable(),
  parent_id: z.string().regex(uuidRegex, "Invalid department ID").or(z.literal("")).optional().nullable(),
});

export type DepartmentValues = z.infer<typeof departmentSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type CategoryValues = z.infer<typeof categorySchema>;

export const employeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Full name is required"),
  role: z.enum(["employee", "asset_manager", "department_head", "admin"]).default("employee"),
  department_id: z.string().regex(uuidRegex, "Please select a department").or(z.literal("")).optional().nullable(),
  employee_id: z.string().min(2, "Employee ID is required"),
});

export type EmployeeValues = z.infer<typeof employeeSchema>;
