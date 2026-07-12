"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookingSchema, BookingValues } from "../validators/booking-schemas";
import { createBooking } from "../actions/booking-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function BookingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      asset_id: "",
      start_time: "",
      end_time: "",
      purpose: "",
    },
  });

  async function onSubmit(values: BookingValues) {
    setError(null);
    const result = await createBooking(values);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/bookings");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Book Resource</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Reserve a shared asset or resource.
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset_id" className="text-[var(--text-primary)]">Resource (Asset UUID for MVP)</Label>
            <Input
              id="asset_id"
              placeholder="UUID of the resource"
              {...form.register("asset_id")}
              className="border-[var(--border)] focus:ring-[var(--primary)]"
            />
            {form.formState.errors.asset_id && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.asset_id.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-[var(--text-primary)]">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...form.register("start_time")}
                className="border-[var(--border)] focus:ring-[var(--primary)] text-[var(--text-primary)]"
              />
              {form.formState.errors.start_time && (
                <p className="text-sm text-[var(--danger)]">{form.formState.errors.start_time.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-[var(--text-primary)]">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...form.register("end_time")}
                className="border-[var(--border)] focus:ring-[var(--primary)] text-[var(--text-primary)]"
              />
              {form.formState.errors.end_time && (
                <p className="text-sm text-[var(--danger)]">{form.formState.errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-[var(--text-primary)]">Purpose (Optional)</Label>
            <Input
              id="purpose"
              placeholder="Why do you need this resource?"
              {...form.register("purpose")}
              className="border-[var(--border)] focus:ring-[var(--primary)]"
            />
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
            {form.formState.isSubmitting ? "Confirming..." : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}
