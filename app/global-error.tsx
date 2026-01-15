"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {error.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

