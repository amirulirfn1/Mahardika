const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/agency", label: "Agency · Overview" },
  { href: "/dashboard/agency/customers", label: "Agency · Customers" },
  { href: "/dashboard/agency/policies", label: "Agency · Policies" },
  { href: "/dashboard/agency/loyalty", label: "Agency · Loyalty" },
  { href: "/dashboard/agency/communications", label: "Agency · Communications" },
  { href: "/dashboard/customer", label: "Customer Dashboard" },
  { href: "/dashboard/staff", label: "Staff Dashboard" },
  { href: "/shop/example", label: "Shop example" },
];

export default function AllPages() {
  return (
    <main>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl space-y-4 px-6 md:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">All pages</h1>
          <p className="text-base text-muted-foreground">
            Quick shortcuts to explore every surface of the app while developing locally.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition hover:border-primary/60 hover:text-primary"
                  href={link.href}
                >
                  <span>{link.label}</span>
                  <span aria-hidden>→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
