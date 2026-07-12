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
