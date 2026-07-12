"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { assetSchema, AssetValues } from "../validators/asset-schemas";
import { createAsset, updateAsset } from "../actions/asset-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, UploadCloud, File, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Note: In a full app, departments and categories would be fetched and passed as props for select fields
export function AssetForm({ 
  departments = [], 
  categories = [], 
  initialData 
}: { 
  departments?: any[], 
  categories?: any[], 
  initialData?: any 
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<AssetValues>({
    resolver: zodResolver(assetSchema) as any,
    defaultValues: {
      asset_tag: initialData?.asset_tag || "",
      name: initialData?.name || "",
      serial_number: initialData?.serial_number || "",
      category_id: initialData?.category_id || "",
      department_id: initialData?.department_id || "",
      status: initialData?.status || "available",
      condition: initialData?.condition || "good",
      purchase_date: initialData?.purchase_date || "",
      purchase_cost: initialData?.purchase_cost || 0,
      warranty_expiry: initialData?.warranty_expiry || "",
      location: initialData?.location || "",
      notes: initialData?.notes || "",
      photo: initialData?.photo || null,
    },
  });

  async function onSubmit(values: AssetValues) {
    setError(null);
    setUploading(true);

    let photoUrl = values.photo || null;

    if (file) {
      try {
        const supabase = createClient();
        
        // Dynamic bucket auto-creation
        await supabase.storage.createBucket("asset-documents", { public: true });

        const fileExt = file.name.split(".").pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from("asset-documents")
          .upload(filePath, file);

        if (uploadError) {
          setError(`File upload failed: ${uploadError.message}`);
          setUploading(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("asset-documents")
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      } catch (err: any) {
        setError(`File upload error: ${err.message}`);
        setUploading(false);
        return;
      }
    }

    const submissionValues = {
      ...values,
      photo: photoUrl,
    };

    const result = initialData?.id 
      ? await updateAsset(initialData.id, submissionValues)
      : await createAsset(submissionValues);
      
    setUploading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/assets");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          {initialData?.id ? "Edit Asset" : "Register Asset"}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {initialData?.id ? "Modify the existing asset properties." : "Add a new physical asset to the inventory."}
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
            <Label htmlFor="asset_tag" className="text-[var(--text-primary)]">Asset Tag (Required)</Label>
            <Input
              id="asset_tag"
              placeholder="e.g. AF-LT-042"
              {...form.register("asset_tag")}
              className="border-[var(--border)] focus:ring-[var(--primary)] uppercase"
            />
            {form.formState.errors.asset_tag && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.asset_tag.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--text-primary)]">Asset Name (Required)</Label>
            <Input
              id="name"
              placeholder="e.g. MacBook Pro 16&quot;"
              {...form.register("name")}
              className="border-[var(--border)] focus:ring-[var(--primary)]"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serial_number" className="text-[var(--text-primary)]">Serial Number</Label>
            <Input
              id="serial_number"
              placeholder="Manufacturer serial"
              {...form.register("serial_number")}
              className="border-[var(--border)] focus:ring-[var(--primary)] uppercase"
            />
          </div>
          
          <div className="space-y-2">
             <Label htmlFor="department_id" className="text-[var(--text-primary)]">Department</Label>
             <select
               id="department_id"
               {...form.register("department_id")}
               className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
             >
               <option value="">Select a department</option>
               {departments.map((dept) => (
                 <option key={dept.id} value={dept.id}>
                   {dept.name}
                 </option>
               ))}
             </select>
             {form.formState.errors.department_id && (
               <p className="text-sm text-[var(--danger)]">{form.formState.errors.department_id.message}</p>
             )}
          </div>
          
          <div className="space-y-2">
             <Label htmlFor="category_id" className="text-[var(--text-primary)]">Category</Label>
             <select
               id="category_id"
               {...form.register("category_id")}
               className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
             >
               <option value="">Select a category</option>
               {categories.map((cat) => (
                 <option key={cat.id} value={cat.id}>
                   {cat.name}
                 </option>
               ))}
             </select>
             {form.formState.errors.category_id && (
               <p className="text-sm text-[var(--danger)]">{form.formState.errors.category_id.message}</p>
             )}
          </div>
          {/* Document Receipt / Photo Upload */}
          <div className="space-y-2 border-t border-[var(--border)] pt-4">
            <Label className="text-[var(--text-primary)]">Asset Document / Receipt Photo</Label>
            <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 flex flex-col items-center justify-center bg-[var(--background)] hover:border-[var(--primary)] transition-colors relative">
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <File className="w-5 h-5 text-[var(--primary)]" />
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setFile(null);
                    }}
                    className="p-1 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : initialData?.photo ? (
                <div className="text-center space-y-2">
                  <p className="text-xs text-[var(--text-secondary)]">Currently has document uploaded:</p>
                  <a 
                    href={initialData.photo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-[var(--primary)] hover:underline block truncate max-w-xs mx-auto"
                  >
                    View Current Document
                  </a>
                  <p className="text-[10px] text-[var(--text-muted)]">Select a new file to replace it</p>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <UploadCloud className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                  <p className="text-xs text-[var(--text-secondary)] font-medium">Click or drag receipt PDF or image here</p>
                  <p className="text-[10px] text-[var(--text-muted)]">PDF, PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
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
            disabled={form.formState.isSubmitting || uploading}
          >
            {form.formState.isSubmitting || uploading
              ? (initialData?.id ? "Saving..." : "Registering...") 
              : (initialData?.id ? "Save Changes" : "Register Asset")}
          </Button>
        </div>
      </form>
    </div>
  );
}
