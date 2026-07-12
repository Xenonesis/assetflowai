import { z } from "zod";

export const assetSchema = z.object({
  asset_tag: z.string().min(2, "Asset tag is required"),
  name: z.string().min(2, "Asset name is required"),
  serial_number: z.string().optional(),
  category_id: z.string().uuid("Please select a category"),
  department_id: z.string().uuid("Please select a department"),
  status: z.enum(["available", "reserved", "allocated", "maintenance", "retired", "disposed"]).default("available"),
  condition: z.enum(["new", "good", "fair", "poor", "damaged"]).default("good"),
  purchase_date: z.string().optional(),
  purchase_cost: z.coerce.number().min(0).optional(),
  warranty_expiry: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type AssetValues = z.infer<typeof assetSchema>;

export const allocationSchema = z.object({
  asset_id: z.string().uuid(),
  allocated_to: z.string().uuid("Please select an employee"),
  expected_return: z.string().optional(),
  condition_on_allocation: z.enum(["new", "good", "fair", "poor", "damaged"]),
});

export type AllocationValues = z.infer<typeof allocationSchema>;
