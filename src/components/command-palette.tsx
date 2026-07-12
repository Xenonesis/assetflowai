"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, Box, User, Terminal, Plus, Calendar, Wrench, Sparkles } from "lucide-react";

interface SearchItem {
  id: string;
  name: string;
  subtitle: string;
  type: "asset" | "profile" | "shortcut" | "action";
  href: string;
  icon: React.ReactNode;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const shortcuts: SearchItem[] = [
    { id: "nav-dash", name: "Go to Dashboard", subtitle: "Overview stats", type: "shortcut", href: "/dashboard", icon: <Terminal className="w-4 h-4 text-sky-500" /> },
    { id: "nav-assets", name: "Go to Assets", subtitle: "Asset catalog", type: "shortcut", href: "/assets", icon: <Box className="w-4 h-4 text-emerald-500" /> },
    { id: "nav-bookings", name: "Go to Bookings", subtitle: "Calendar reservations", type: "shortcut", href: "/bookings", icon: <Calendar className="w-4 h-4 text-purple-500" /> },
    { id: "nav-maintenance", name: "Go to Maintenance", subtitle: "Support tickets", type: "shortcut", href: "/maintenance", icon: <Wrench className="w-4 h-4 text-amber-500" /> },
  ];

  const actions: SearchItem[] = [
    { id: "act-new-asset", name: "Register New Asset", subtitle: "Add physical inventory", type: "action", href: "/assets/new", icon: <Plus className="w-4 h-4 text-teal-500" /> },
    { id: "act-new-booking", name: "Reserve a Resource", subtitle: "Schedule time slot", type: "action", href: "/bookings/new", icon: <Plus className="w-4 h-4 text-purple-500" /> },
    { id: "act-new-maint", name: "File Maintenance Ticket", subtitle: "Report issue", type: "action", href: "/maintenance/new", icon: <Plus className="w-4 h-4 text-amber-500" /> },
    { id: "act-new-emp", name: "Add Employee Profile", subtitle: "Register staff member", type: "action", href: "/organization/employees/new", icon: <Plus className="w-4 h-4 text-indigo-500" /> },
  ];

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);

    const fetchItems = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        
        // Fetch active assets
        const { data: assets } = (await supabase
          .from("assets")
          .select("id, name, asset_tag")
          .is("deleted_at", null)
          .limit(20)) as any;

        // Fetch active employees
        const { data: profiles } = (await supabase
          .from("profiles")
          .select("id, full_name, email")
          .limit(20)) as any;

        const assetItems: SearchItem[] = (assets || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          subtitle: a.asset_tag,
          type: "asset",
          href: `/assets/${a.id}`,
          icon: <Box className="w-4 h-4 text-emerald-500" />,
        }));

        const profileItems: SearchItem[] = (profiles || []).map((p: any) => ({
          id: p.id,
          name: p.full_name,
          subtitle: p.email,
          type: "profile",
          href: `/organization/employees/${p.id}`,
          icon: <User className="w-4 h-4 text-violet-500" />,
        }));

        setItems([...actions, ...shortcuts, ...assetItems, ...profileItems]);
      } catch (err) {
        console.error("Command palette load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: SearchItem) => {
    router.push(item.href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        handleSelect(filteredItems[activeIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[50vh] animate-in fade-in slide-in-from-top-4 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-[var(--border)] bg-[var(--background)] px-1.5 font-mono text-[10px] font-medium text-[var(--text-muted)] opacity-100 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-[var(--primary)]" />
              Loading system index...
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between text-left p-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20" 
                      : "text-[var(--text-secondary)] hover:bg-[var(--background)] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded bg-[var(--background)] border border-[var(--border)] shrink-0 ${isActive ? "text-[var(--primary)] border-[var(--primary)]/20" : ""}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">{item.name}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--background)] border border-[var(--border)] px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Help Footer */}
        <div className="px-4 py-2 bg-[var(--background)] border-t border-[var(--border)] text-[10px] text-[var(--text-muted)] flex items-center gap-4">
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
