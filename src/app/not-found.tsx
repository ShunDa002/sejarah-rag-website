import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1
        className="text-8xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-tertiary)",
        }}
      >
        404
      </h1>

      <div className="flex flex-col gap-2">
        <h2
          className="text-2xl font-semibold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text-primary)",
          }}
        >
          Page Not Found
        </h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
        style={{
          backgroundColor: "var(--color-accent-sparkle)",
          color: "#ffffff",
          borderRadius: "var(--radius-md)",
        }}
      >
        ← Return Home
      </Link>
    </div>
  );
}
