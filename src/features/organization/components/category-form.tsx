"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { categorySchema, CategoryValues } from "../validators/org-schemas";
import { createCategory } from "../actions/category-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function CategoryForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "box", // Default lucide icon name
    },
  });

  async function onSubmit(values: CategoryValues) {
    setError(null);
    const result = await createCategory(values);
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
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">New Category</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Create a new asset classification category.
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[var(--text-primary)]">Category Name</Label>
          <Input
            id="name"
            placeholder="e.g. Laptops"
            {...form.register("name")}
            className="border-[var(--border)] focus:ring-[var(--primary)]"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-[var(--text-primary)]">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="Brief description of the category"
            {...form.register("description")}
            className="border-[var(--border)] focus:ring-[var(--primary)]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon" className="text-[var(--text-primary)]">Icon Name (Lucide)</Label>
          <Input
            id="icon"
            placeholder="e.g. laptop, monitor, smartphone"
            {...form.register("icon")}
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
            {form.formState.isSubmitting ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}
