import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServerClient } from "@/lib/supabase/server";

export default async function NotesPage() {
  const supabase = getServerClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title")
    .order("id", { ascending: true });

  if (error) {
    return (
      <Section>
        <SectionHeading title="Notes" subtitle="Your saved notes" />
        <div className="text-sm text-red-600 dark:text-red-400">Error loading notes: {error.message}</div>
      </Section>
    );
  }

  return (
    <main>
      <Section>
        <SectionHeading title="Notes" subtitle="Your saved notes" />
        {notes && notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((n) => (
              <Card key={n.id}>
                <CardContent>
                  <div className="text-sm text-neutral-500">Note</div>
                  <div className="mt-1 text-base font-medium">{n.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-neutral-600 dark:text-white/70">No notes yet.</div>
        )}
      </Section>
    </main>
  );
}
