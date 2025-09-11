import { getServerClient } from "@/lib/supabase/server";

export default async function NotesPage() {
  const supabase = getServerClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title")
    .order("id", { ascending: true });

  if (error) {
    return (
      <pre>
        Error loading notes: {error.message}
      </pre>
    );
  }

  return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}

