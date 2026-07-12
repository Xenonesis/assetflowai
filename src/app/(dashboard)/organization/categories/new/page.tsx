import { CategoryForm } from "@/features/organization/components/category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Organization</span>
        <span>/</span>
        <span>Categories</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New</span>
      </div>
      
      <CategoryForm />
    </div>
  );
}
