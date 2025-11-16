"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BrowserUnsupportedDialog } from "~/components/browser-unsupported-dialog";
import { Footer } from "~/components/footer";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden p-6">
      <BrowserUnsupportedDialog />

      {/* Main Content */}
      <main className="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <h1 className="font-bold font-mono text-4xl text-zinc-100">
                local-quest.ras.sh
              </h1>
              <Button asChild size="sm" variant="outline">
                <a
                  data-umami-event="github_link_clicked"
                  data-umami-event-location="intro_screen"
                  href="https://github.com/ras-sh/local-quest"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SiGithub className="size-4" />
                  GitHub
                </a>
              </Button>
            </div>
            <p className="font-sans text-xl text-zinc-300 leading-relaxed">
              🗺️ Local-first AI text adventures using your browser's built-in AI.
              Infinite worlds generated and played entirely on your device.
            </p>
            <p className="font-sans text-base text-zinc-400 leading-relaxed">
              Choose your adventure seed and let the AI create a unique world
              for you to explore. Every decision matters, and every playthrough
              is different.
            </p>
          </div>

          <Button
            className="w-full md:w-auto"
            onClick={() => navigate({ to: "/world-selection" })}
            size="lg"
          >
            Begin Your Adventure
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-20">
        <div className="mx-auto w-full max-w-3xl p-6">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
