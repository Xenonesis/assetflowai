export interface Asset {
  id: string;
  asset_tag: string;
  name: string;
  serial_number?: string | null;
  category_id: string;
  department_id: string;
  status: "available" | "reserved" | "allocated" | "maintenance" | "retired" | "disposed";
  condition: "new" | "good" | "fair" | "poor" | "damaged";
  purchase_date?: string | null;
  purchase_cost?: number | null;
  warranty_expiry?: string | null;
  current_holder_id?: string | null;
  location?: string | null;
  qr_code?: string | null;
  photo?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  department?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  holder?: { full_name: string; email: string } | null;
}
