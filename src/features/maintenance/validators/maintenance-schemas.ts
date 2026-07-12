import { z } from "zod";

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const maintenanceRequestSchema = z.object({
  asset_id: z.string().regex(uuidRegex, "Please select an asset"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  description: z.string().min(10, "Please provide a detailed description (min 10 chars)"),
});

export type MaintenanceRequestValues = z.infer<typeof maintenanceRequestSchema>;
