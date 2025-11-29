"use client";

import { Button } from "@ras-sh/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BrowserUnsupportedDialog } from "~/components/browser-unsupported-dialog";
import { Footer } from "~/components/footer";
import { CustomWorldInput } from "~/components/world-selection/custom-world-input";
import { GenerationProgressDialog } from "~/components/world-selection/generation-progress-dialog";
import { SeedPromptList } from "~/components/world-selection/seed-prompt-list";
import { generateInitialMessage } from "~/lib/generate-initial-message";
import { generateWorldData } from "~/lib/generate-world";
import { SEED_PROMPTS } from "~/lib/seed-prompts";
import { transformPrompt } from "~/lib/transform-prompt";
import { useWorldStore } from "~/stores/world-store";

export const Route = createFileRoute("/world-selection")({
  component: WorldSelection,
});

export default function WorldSelection() {
  const navigate = useNavigate();
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedFields, setCompletedFields] = useState<Set<string>>(
    new Set()
  );
  const [currentField, setCurrentField] = useState<string | undefined>();
  const [isInitialMessageComplete, setIsInitialMessageComplete] =
    useState(false);
  const [isTransformingPrompt, setIsTransformingPrompt] = useState(false);
  const { setWorldData, setSeedPrompt, setInitialMessage } = useWorldStore();

  // Configure Fuse.js for fuzzy searching
  const fuse = useMemo(
    () =>
      new Fuse(SEED_PROMPTS, {
        keys: ["title", "description"],
        threshold: 0.3, // 0.0 = perfect match, 1.0 = match anything
        includeScore: true,
        minMatchCharLength: 1,
      }),
    []
  );

  // Filter seed prompts based on search query using Fuse.js
  const filteredSeedPrompts = useMemo(() => {
    if (!searchQuery.trim()) {
      return SEED_PROMPTS;
    }
    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [searchQuery, fuse]);

  const handleStartAdventure = async (prompt: string) => {
    console.log("🚀 handleStartAdventure called with prompt:", prompt);
    setIsGenerating(true);

    try {
      // Store the seed prompt
      console.log("📝 Storing seed prompt");
      setSeedPrompt(prompt);

      // Generate world data
      console.log("🌍 Starting world data generation...");
      setCompletedFields(new Set());
      const worldData = await generateWorldData(prompt, (progress) => {
        setCompletedFields(progress.completedFields);
        setCurrentField(progress.currentField);
      });
      console.log("✅ World data generated:", worldData);

      // Store the world data
      console.log("💾 Storing world data");
      setWorldData(worldData);

      // Generate initial message
      console.log("📖 Starting initial message generation...");
      setIsInitialMessageComplete(false);
      setCurrentField("openingScene");
      const initialMessage = await generateInitialMessage(
        worldData,
        (progress) => {
          setIsInitialMessageComplete(progress.isComplete);
          // Clear currentField as soon as we mark it complete
          if (progress.isComplete) {
            setCurrentField(undefined);
          }
        }
      );
      console.log("✅ Initial message generated:", initialMessage);

      // Store initial message in world store
      console.log("💾 Storing initial message");
      setInitialMessage(initialMessage);
      setIsInitialMessageComplete(true);
      setCurrentField(undefined);

      // Small delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to adventure
      console.log("🧭 Navigating to adventure");
      navigate({ to: "/adventure" });
    } catch (error) {
      console.error("❌ Error generating world:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate world. Please try again."
      );
      setIsGenerating(false);
      setCompletedFields(new Set());
      setCurrentField(undefined);
      setIsInitialMessageComplete(false);
    }
  };

  const handleSeedSelect = (seedPrompt: string) => {
    setSelectedSeed(seedPrompt);
    setCustomPrompt("");
  };

  const handleRandomSelect = () => {
    const randomIndex = Math.floor(Math.random() * SEED_PROMPTS.length);
    const randomSeed = SEED_PROMPTS[randomIndex];
    if (randomSeed) {
      handleSeedSelect(randomSeed.prompt);
      setSearchQuery(""); // Clear search to show the selected item
    }
  };

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    setSelectedSeed(null);
  };

  const canStartAdventure =
    selectedSeed !== null || customPrompt.trim().length > 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <BrowserUnsupportedDialog />

      {/* Text Adventure Style Container */}
      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col font-mono">
        {/* Main content area */}
        <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6">
          <div className="w-full max-w-2xl space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-bold text-2xl text-zinc-100">
                &gt; Choose Your World
              </h1>
              <p className="text-zinc-400">
                &gt; Select a seed prompt or create your own custom world.
              </p>
            </div>

            <SeedPromptList
              disabled={isGenerating}
              filteredSeedPrompts={filteredSeedPrompts}
              onRandomSelect={handleRandomSelect}
              onSearchChange={setSearchQuery}
              onSeedSelect={handleSeedSelect}
              searchQuery={searchQuery}
              selectedSeed={selectedSeed}
            />

            <CustomWorldInput
              disabled={isGenerating}
              onChange={handleCustomPromptChange}
              value={customPrompt}
            />

            {/* Start Adventure Button */}
            <div className="flex justify-center pt-4">
              <Button
                className="w-full font-mono md:w-auto"
                disabled={
                  !canStartAdventure || isGenerating || isTransformingPrompt
                }
                onClick={async () => {
                  console.log("🔘 Button clicked!", {
                    selectedSeed,
                    customPrompt,
                    canStartAdventure,
                  });
                  // Use selected seed as-is, or transform custom prompt
                  const rawPrompt = selectedSeed || customPrompt.trim();
                  let prompt: string;
                  if (selectedSeed) {
                    prompt = rawPrompt;
                  } else {
                    setIsTransformingPrompt(true);
                    try {
                      console.log("🔄 Transforming custom prompt...");
                      prompt = await transformPrompt(rawPrompt);
                      console.log("✅ Prompt transformed:", prompt);
                    } catch (error) {
                      console.error("❌ Error transforming prompt:", error);
                      setIsTransformingPrompt(false);
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Failed to process prompt. Please try again."
                      );
                      return;
                    } finally {
                      setIsTransformingPrompt(false);
                    }
                  }
                  console.log("📋 Resolved prompt:", prompt);
                  if (prompt) {
                    console.log("✅ Calling handleStartAdventure");
                    await handleStartAdventure(prompt);
                  } else {
                    console.log("❌ No prompt available");
                    toast.error("No prompt available. Please try again.");
                  }
                }}
                size="lg"
              >
                {isTransformingPrompt ? (
                  <>&gt; Processing prompt...</>
                ) : isGenerating ? (
                  <>&gt; Generating...</>
                ) : (
                  <>&gt; Start Adventure</>
                )}
              </Button>
            </div>
          </div>

          <GenerationProgressDialog
            completedFields={completedFields}
            currentField={currentField}
            isInitialMessageComplete={isInitialMessageComplete}
            isOpen={isGenerating}
          />
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
