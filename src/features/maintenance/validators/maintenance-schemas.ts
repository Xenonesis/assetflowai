import { z } from "zod";

export const maintenanceRequestSchema = z.object({
  asset_id: z.string().uuid("Please select an asset"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  description: z.string().min(10, "Please provide a detailed description (min 10 chars)"),
});

export type MaintenanceRequestValues = z.infer<typeof maintenanceRequestSchema>;
