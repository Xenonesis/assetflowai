import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  code: z.string().min(2, "Department code is required"),
  description: z.string().optional(),
  head_id: z.string().uuid().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
});

export type DepartmentValues = z.infer<typeof departmentSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type CategoryValues = z.infer<typeof categorySchema>;
