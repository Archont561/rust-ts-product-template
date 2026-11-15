import downloads from "@/content/downloads.json" with { type: "json" };

export default function DownloadsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Download Product {downloads.version}</h1>
        <p className="opacity-75">
          Install the native Desktop or Mobile app, or add the multi-browser MV3 extension.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Desktop (Tauri v2)</h2>
        <ul className="space-y-2">
          {downloads.desktop.map((item) => (
            <li key={item.target} className="rounded-md border p-4">
              <div className="font-medium">{item.label}</div>
              <a href={item.url} className="text-sm underline">
                {item.filename}
              </a>
              <div className="text-xs opacity-70">SHA-256: {item.sha256}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Mobile (iOS &amp; Android)</h2>
        <ul className="space-y-2">
          {downloads.mobile.map((item) => (
            <li key={item.platform} className="rounded-md border p-4">
              <div className="font-medium">{item.label}</div>
              <a href={item.url} className="text-sm underline">
                {item.url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Browser Extensions (WXT MV3)</h2>
        <ul className="space-y-2">
          {downloads.extension.map((item) => (
            <li key={item.browser} className="rounded-md border p-4">
              <div className="font-medium">{item.label}</div>
              <a href={item.url} className="text-sm underline">
                {item.url}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
