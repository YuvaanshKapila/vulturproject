import Link from "next/link";
import { getRoles } from "@/lib/data";

export default function Home() {
  const roles = getRoles();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Candidate Matcher</h1>
      <p className="mt-2 text-neutral-500">
        Select a role to see the best-matched candidates from the network.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {roles.map((role) => (
          <Link
            key={role.id}
            href={`/roles/${role.id}`}
            className="group rounded-xl border border-neutral-200 p-5 transition hover:border-ember hover:shadow-sm dark:border-neutral-800"
          >
            <div className="text-xs font-medium uppercase tracking-wide text-ember">
              {role.department}
            </div>
            <div className="mt-1 text-lg font-semibold group-hover:text-ember">
              {role.title}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              {role.location}
              {role.workplaceType ? ` · ${role.workplaceType}` : ""}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
