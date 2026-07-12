import { z } from "zod";

export const bookingSchema = z.object({
  asset_id: z.string().uuid("Please select a resource to book"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  purpose: z.string().optional(),
}).refine((data) => new Date(data.start_time) < new Date(data.end_time), {
  message: "End time must be after start time",
  path: ["end_time"],
});

export type BookingValues = z.infer<typeof bookingSchema>;
