"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { usePostHog } from "@posthog/react";
import { Button } from "@ras-sh/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BrowserUnsupportedDialog } from "~/components/browser-unsupported-dialog";
import { Footer } from "~/components/footer";

export const Route = createFileRoute("/")({
  component: Home,
});

export default function Home() {
  const navigate = useNavigate();
  const posthog = usePostHog();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BrowserUnsupportedDialog />

      {/* Text Adventure Style Container */}
      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col font-mono">
        {/* Main Content */}
        <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6">
          <div className="w-full max-w-2xl space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <h1 className="font-bold text-3xl text-zinc-100 sm:text-4xl">
                  local-quest.ras.sh
                </h1>
                <Button asChild variant="outline">
                  <a
                    href="https://github.com/richardsolomou/local-quest"
                    onClick={() =>
                      posthog?.capture("github_link_clicked", {
                        location: "intro_screen",
                      })
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SiGithub className="size-4" />
                    GitHub
                  </a>
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-xl text-zinc-300 leading-relaxed">
                  &gt; 🗺️ Local-first AI text adventures using your browser's
                  built-in AI. Infinite worlds generated and played entirely on
                  your device.
                </p>
                <p className="text-base text-zinc-400 leading-relaxed">
                  &gt; Choose your adventure seed and let the AI create a unique
                  world for you to explore. Every decision matters, and every
                  playthrough is different.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                className="w-full font-mono md:w-auto"
                onClick={() => navigate({ to: "/world-selection" })}
                size="lg"
              >
                &gt; Begin Your Adventure
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="sticky bottom-0 z-20">
          <div className="mx-auto w-full max-w-4xl p-6">
            <Footer />
          </div>
        </footer>
      </div>
    </div>
  );
}
