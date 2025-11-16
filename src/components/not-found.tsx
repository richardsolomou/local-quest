import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background p-6">
      {/* Text Adventure Style Container */}
      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col items-center justify-center font-mono">
        <div className="w-full max-w-2xl space-y-6 p-6">
          <div className="space-y-4">
            <h1 className="font-bold text-2xl text-zinc-100">
              &gt; Page Not Found
            </h1>
            <div className="text-zinc-400">
              {children || (
                <p className="text-zinc-300">
                  &gt; The page you are looking for does not exist.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="font-mono"
              onClick={() => window.history.back()}
              type="button"
              variant="outline"
            >
              &gt; Go Back
            </Button>
            <Button asChild className="font-mono">
              <Link to="/">&gt; Start Over</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
