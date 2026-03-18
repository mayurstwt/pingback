import Link from "next/link";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthPageShell({ eyebrow, title, description, children }: AuthPageShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10 sm:px-8">
      <section className="w-full space-y-8">
        <div className="space-y-4">
          <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-white">
            Back to home
          </Link>
          <div className="max-w-2xl space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--primary)]">{eyebrow}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="text-lg text-[var(--muted-foreground)]">{description}</p>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}
