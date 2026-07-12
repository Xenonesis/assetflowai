import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { tool } from "ai";

// These tools will be passed to the AI model
export const aiTools = {
  searchAssets: tool({
    description: "Search for assets by name, tag, or serial number",
    inputSchema: z.object({
      query: z.string().describe("The search query"),
    }),
    execute: async ({ query }: { query: string }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("assets")
        .select("id, name, asset_tag, status, current_holder_id")
        .or(`name.ilike.%${query}%,asset_tag.ilike.%${query}%`)
        .limit(5);

      if (error) throw new Error(error.message);
      return data as any;
    },
  }),
  
  getAssetStatus: tool({
    description: "Get the current status and allocation of a specific asset by its tag",
    inputSchema: z.object({
      asset_tag: z.string().describe("The exact asset tag (e.g. AF-LT-001)"),
    }),
    execute: async ({ asset_tag }: { asset_tag: string }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("assets")
        .select(`
          name, 
          status, 
          holder:profiles!current_holder_id(full_name)
        `)
        .eq("asset_tag", asset_tag)
        .single();

      if (error) return { error: "Asset not found" };
      return data as any;
    },
  }),
};
