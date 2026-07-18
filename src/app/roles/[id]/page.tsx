import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoleById, getRankedForRole } from "@/lib/data";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";

export default async function RolePage({ params }: { params: { id: string } }) {
  const role = getRoleById(params.id);
  if (!role) notFound();

  const ranked = await getRankedForRole(params.id, 20);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/" className="text-sm text-neutral-500 hover:text-ember">
        ← All roles
      </Link>

      <div className="mt-4">
        <div className="text-xs font-medium uppercase tracking-wide text-ember">
          {role.department}
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{role.title}</h1>
        <p className="mt-1 text-neutral-500">
          {role.location}
          {role.workplaceType ? ` · ${role.workplaceType}` : ""}
          {role.isRemote ? " · Remote-friendly" : ""}
        </p>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Top {ranked.length} candidates
      </h2>

      <div className="mt-4 space-y-3">
        {ranked.map(({ contact, score }, i) => (
          <div key={contact.id} className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400 tabular-nums">#{i + 1}</span>
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold hover:text-ember"
                  >
                    {contact.firstName} {contact.lastName}
                  </a>
                  {contact.openToWork && (
                    <span className="rounded-full bg-ember/10 px-2 py-0.5 text-xs font-medium text-ember">
                      Open to work
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-sm text-neutral-600">
                  {contact.currentTitle}
                  {contact.currentCompany ? ` @ ${contact.currentCompany}` : ""}
                </div>
                <div className="text-xs text-neutral-400">{contact.location}</div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-2xl font-bold text-ember tabular-nums">{score.total}</div>
                <div className="text-xs text-neutral-400">match</div>
              </div>
            </div>

            {contact.topSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {contact.topSkills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <ScoreBreakdown signals={score.signals} />
          </div>
        ))}
      </div>
    </main>
  );
}
