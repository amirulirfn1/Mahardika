import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function main() {
  if (!url || !serviceRole) {
    console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const admin = createClient(url, serviceRole);
  const email1 = "e2e.agency1@example.com";
  const email2 = "e2e.agency2@example.com";
  const password = "Passw0rd!";

  const u1 = (await admin.auth.admin.getUserByEmail(email1)).data.user
    || (await admin.auth.admin.createUser({ email: email1, password, email_confirm: true })).data.user!;
  const u2 = (await admin.auth.admin.getUserByEmail(email2)).data.user
    || (await admin.auth.admin.createUser({ email: email2, password, email_confirm: true })).data.user!;

  const slug1 = "e2e-agency-1";
  const slug2 = "e2e-agency-2";
  const ag1 = (await admin.from("agencies").select("id").eq("slug", slug1).maybeSingle()).data?.id
    || (await admin.from("agencies").insert({ name: "E2E Agency 1", slug: slug1, owner_id: u1.id }).select("id").single()).data!.id;
  const ag2 = (await admin.from("agencies").select("id").eq("slug", slug2).maybeSingle()).data?.id
    || (await admin.from("agencies").insert({ name: "E2E Agency 2", slug: slug2, owner_id: u2.id }).select("id").single()).data!.id;

  await admin.from("profiles").upsert({ user_id: u1.id, agency_id: ag1, role: "staff" }, { onConflict: "user_id" });
  await admin.from("profiles").upsert({ user_id: u2.id, agency_id: ag2, role: "staff" }, { onConflict: "user_id" });

  const custEmail = "e2e.customer@example.com";
  await admin.from("customers").upsert({ agency_id: ag1, full_name: "E2E Customer", email: custEmail });
  console.log("Seed complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



