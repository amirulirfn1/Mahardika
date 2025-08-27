export default function AllPages() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/agency", label: "Agency Dashboard" },
    { href: "/dashboard/agency/customers", label: "Agency • Customers" },
    { href: "/dashboard/agency/policies", label: "Agency • Policies" },
    { href: "/dashboard/agency/loyalty", label: "Agency • Loyalty" },
    { href: "/dashboard/agency/communications", label: "Agency • Communications" },
    { href: "/dashboard/customer", label: "Customer Dashboard" },
    { href: "/dashboard/staff", label: "Staff Dashboard" },
    { href: "/shop/example", label: "Shop Example" },
  ];
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">All Pages</h1>
      <p className="text-gray-600 mt-2">Quick links to explore the system locally.</p>
      <ul className="mt-6 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <a className="text-blue-600 hover:underline" href={l.href}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}



