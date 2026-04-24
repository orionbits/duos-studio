import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SavedImportRow = {
  id?: string;
  title?: string | null;
  raw_input: string;
  parsed_blocks: unknown;
  created_at?: string;
};

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }

  return browserClient;
}

export async function saveTaggedImport(row: SavedImportRow) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    throw new Error("Missing Supabase environment variables.");
  }

  const { data, error } = await client
    .from("tagged_imports")
    .insert(row)
    .select("id,title,raw_input,parsed_blocks,created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function loadLatestTaggedImport() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    throw new Error("Missing Supabase environment variables.");
  }

  const { data, error } = await client
    .from("tagged_imports")
    .select("id,title,raw_input,parsed_blocks,created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
