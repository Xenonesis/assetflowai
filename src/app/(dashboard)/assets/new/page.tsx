import { AssetForm } from "@/features/assets/components/asset-form";

export default function NewAssetPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Assets</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Register New</span>
      </div>
      
      {/* In a real scenario, we'd fetch departments and categories to pass to the form here */}
      <AssetForm />
    </div>
  );
}
