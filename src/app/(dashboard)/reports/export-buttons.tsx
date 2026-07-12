"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

export function ExportButtons() {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    toast.success("CSV export initialized!");
    const csvContent = "data:text/csv;charset=utf-8,Valuation Report,AssetFlow AI\nExported At," + new Date().toLocaleDateString() + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `assetflow_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handlePrint}
        className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
      >
        <FileText className="w-4 h-4 mr-2" />
        Print PDF
      </Button>
      <Button 
        onClick={handleExportCSV}
        className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] font-semibold"
      >
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
}
