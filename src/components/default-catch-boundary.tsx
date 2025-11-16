import { Button } from "@ras-sh/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background p-6">
      {/* Text Adventure Style Container */}
      <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-1 flex-col items-center justify-center font-mono">
        <div className="w-full max-w-2xl space-y-6 p-6">
          <div className="space-y-4">
            <h1 className="font-bold text-2xl text-zinc-100">
              &gt; Error Occurred
            </h1>
            <div className="rounded border border-red-500/20 bg-red-500/10 p-4 font-mono">
              <div className="text-red-400 text-sm">
                <ErrorComponent error={error} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="rounded-none font-mono"
              onClick={() => {
                router.invalidate();
              }}
              type="button"
              variant="outline"
            >
              &gt; Try Again
            </Button>
            {isRoot ? (
              <Button asChild className="rounded-none font-mono">
                <Link to="/">&gt; Home</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="rounded-none font-mono"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
                variant="outline"
              >
                <Link to="/">&gt; Go Back</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
