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
        <div className="text-sm text-destructive">Error loading notes: {error.message}</div>
      </Section>
    );
  }

  return (
    <main>
      <Section>
        <SectionHeading title="Notes" subtitle="Your saved notes" />
        {notes && notes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} radius="marketing" intent="subtle">
                <CardContent density="marketing">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground/80">Note</div>
                  <div className="mt-2 text-base font-medium text-foreground">{note.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/50 p-6 text-sm text-muted-foreground">
            No notes yet. Create a note from the dashboard to see it here.
          </div>
        )}
      </Section>
    </main>
  );
}
