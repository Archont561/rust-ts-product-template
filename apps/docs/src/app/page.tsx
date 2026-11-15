import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide opacity-70">v0.1.0</p>
      <h1 className="text-4xl font-bold tracking-tight">Hello, world.</h1>
      <p className="text-lg opacity-80">
        One product built on composable contracts — running natively across our pure-Rust Axum API
        server, Desktop (Tauri v2), Mobile (iOS &amp; Android), and Browser Extensions (Chrome,
        Firefox, Safari).
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/docs" className="rounded-md border px-4 py-2 font-medium">
          Read Documentation
        </Link>
        <Link href="/docs/api" className="rounded-md border px-4 py-2 font-medium">
          OpenAPI Reference
        </Link>
        <Link href="/downloads" className="rounded-md border px-4 py-2 font-medium">
          Download Apps &amp; Extensions
        </Link>
      </div>
    </main>
  );
}
