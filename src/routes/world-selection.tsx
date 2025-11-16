"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BrowserUnsupportedDialog } from "~/components/browser-unsupported-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { generateInitialMessage } from "~/lib/generate-initial-message";
import { generateWorldData } from "~/lib/generate-world";
import { useWorldStore } from "~/stores/world-store";

export const Route = createFileRoute("/world-selection")({
  component: WorldSelection,
});

const SEED_PROMPTS = [
  {
    title: "Medieval Fantasy",
    description: "A classic fantasy realm with knights, dragons, and magic",
    prompt:
      "You are a text adventure game set in a medieval fantasy world. The player is a brave adventurer exploring a kingdom filled with magic, dragons, and ancient mysteries. Describe the world vividly and present choices that lead to exciting adventures.",
  },
  {
    title: "Cyberpunk Future",
    description: "A neon-lit dystopian city with hackers and AI",
    prompt:
      "You are a text adventure game set in a cyberpunk future. The player is a hacker or mercenary navigating a neon-lit megacity filled with corporate intrigue, AI, and cybernetic enhancements. Create a gritty, high-tech world with meaningful choices.",
  },
  {
    title: "Space Exploration",
    description: "Explore the cosmos and discover alien worlds",
    prompt:
      "You are a text adventure game set in space. The player is a space explorer or starship captain discovering new planets, encountering alien species, and navigating the vastness of the cosmos. Make each discovery feel epic and consequential.",
  },
  {
    title: "Post-Apocalyptic",
    description: "Survive in a world after the collapse",
    prompt:
      "You are a text adventure game set in a post-apocalyptic world. The player is a survivor navigating a dangerous wasteland, scavenging resources, and making difficult moral choices. Create a tense, atmospheric world where every decision matters.",
  },
  {
    title: "Mystery Detective",
    description: "Solve crimes and uncover secrets",
    prompt:
      "You are a text adventure game where the player is a detective solving mysteries. Present clues, suspects, and crime scenes. Allow the player to investigate, question witnesses, and piece together the truth. Make the mystery engaging and solvable.",
  },
  {
    title: "Underwater City",
    description: "Explore the depths of an aquatic civilization",
    prompt:
      "You are a text adventure game set in an underwater city or deep-sea exploration. The player navigates an aquatic world with unique creatures, ancient ruins, and underwater mysteries. Create a sense of wonder and depth.",
  },
];

const WORLD_FIELDS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "setting", label: "Setting" },
  { key: "startingLocation", label: "Starting Location" },
  { key: "initialSituation", label: "Initial Situation" },
  { key: "tone", label: "Tone" },
  { key: "genre", label: "Genre" },
  { key: "characters", label: "Characters" },
  { key: "items", label: "Items" },
  { key: "goals", label: "Goals" },
];

export default function WorldSelection() {
  const navigate = useNavigate();
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedFields, setCompletedFields] = useState<Set<string>>(
    new Set()
  );
  const [currentField, setCurrentField] = useState<string | undefined>();
  const [isInitialMessageComplete, setIsInitialMessageComplete] =
    useState(false);
  const { setWorldData, setSeedPrompt, setInitialMessage } = useWorldStore();

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

      // Navigate to chat
      console.log("🧭 Navigating to chat");
      navigate({ to: "/chat" });
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

  const handleCustomPromptChange = (value: string) => {
    setCustomPrompt(value);
    setSelectedSeed(null);
  };

  const canStartAdventure =
    selectedSeed !== null || customPrompt.trim().length > 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background p-6">
      <BrowserUnsupportedDialog />

      {/* Text Adventure Style Container */}
      <div className="mx-auto w-full max-w-4xl font-mono">
        {/* Main content area */}
        <div className="p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-bold text-2xl text-zinc-100">
                &gt; Choose Your World
              </h1>
              <p className="text-zinc-400">
                &gt; Select a seed prompt or create your own custom world.
              </p>
            </div>

            {/* Seed Prompts */}
            <div className="space-y-3">
              <h2 className="font-semibold text-lg text-zinc-300">
                &gt; Available Worlds:
              </h2>
              <div className="space-y-2">
                {SEED_PROMPTS.map((seed, index) => (
                  <button
                    className={`w-full rounded border p-4 text-left font-mono transition-all ${
                      selectedSeed === seed.prompt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50"
                    }
                      ${isGenerating ? "cursor-not-allowed opacity-50" : ""}
                    `}
                    disabled={isGenerating}
                    key={index}
                    onClick={() => handleSeedSelect(seed.prompt)}
                    type="button"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500">
                        {selectedSeed === seed.prompt
                          ? "[✓]"
                          : `[${index + 1}]`}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {seed.title}
                        </div>
                        <div className="mt-1 text-xs text-zinc-400">
                          {seed.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-zinc-800 border-t pt-6">
              <h2 className="mb-3 font-semibold text-lg text-zinc-300">
                &gt; Custom World:
              </h2>
              <Textarea
                className="min-h-32 resize-none border-zinc-800 bg-zinc-900/30 font-mono text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isGenerating}
                onChange={(e) => handleCustomPromptChange(e.target.value)}
                placeholder="Describe your own text adventure world...&#10;&#10;Example:&#10;You are a text adventure game set in a steampunk Victorian London where the player is an inventor solving mysteries..."
                value={customPrompt}
              />
            </div>
          </div>
        </div>

        {/* Generation Progress Dialog */}
        <Dialog open={isGenerating}>
          <DialogContent className="max-w-md font-mono" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="font-mono text-zinc-100">
                &gt; Generating Your World
              </DialogTitle>
              <DialogDescription className="font-mono text-zinc-400">
                &gt; Creating your text adventure world...
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {/* World Fields */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-zinc-300">
                  &gt; World Data
                </h3>
                <div className="space-y-1.5">
                  {WORLD_FIELDS.map((field) => {
                    const isComplete = completedFields.has(field.key);
                    const isCurrent = currentField === field.key && !isComplete;
                    return (
                      <div
                        className="flex items-center gap-2 text-sm"
                        key={field.key}
                      >
                        {isComplete ? (
                          <span className="text-green-500">[✓]</span>
                        ) : isCurrent ? (
                          <span className="animate-pulse text-zinc-400">
                            [...]
                          </span>
                        ) : (
                          <span className="text-zinc-600">[ ]</span>
                        )}
                        <span
                          className={
                            isComplete
                              ? "text-zinc-300"
                              : isCurrent
                                ? "text-zinc-400"
                                : "text-zinc-600"
                          }
                        >
                          {field.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Initial Message */}
              <div className="space-y-2 border-zinc-800 border-t pt-3">
                <h3 className="font-semibold text-sm text-zinc-300">
                  &gt; Opening Scene
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  {isInitialMessageComplete ? (
                    <>
                      <span className="text-green-500">[✓]</span>
                      <span className="text-zinc-300">Opening scene</span>
                    </>
                  ) : currentField === "openingScene" ? (
                    <>
                      <span className="animate-pulse text-zinc-400">[...]</span>
                      <span className="text-zinc-400">
                        Writing opening scene...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-zinc-600">[ ]</span>
                      <span className="text-zinc-600">Opening scene</span>
                    </>
                  )}
                </div>
              </div>

              {/* Pending Fields Warning */}
              {isInitialMessageComplete && currentField && (
                <div className="border-zinc-800 border-t pt-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="animate-pulse">[...]</span>
                    <span>
                      {currentField === "openingScene"
                        ? "Finalizing opening scene..."
                        : `Finalizing ${WORLD_FIELDS.find((f) => f.key === currentField)?.label || currentField}...`}
                    </span>
                  </div>
                </div>
              )}

              {/* Completion Message */}
              {isInitialMessageComplete &&
                completedFields.size >= 7 && // At least all required fields
                !currentField && (
                  <div className="border-zinc-800 border-t pt-3">
                    <div className="flex items-center gap-2 text-green-500 text-sm">
                      <span>[✓]</span>
                      <span>
                        World generation complete! Starting adventure...
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Bottom action bar */}
        <div className="p-4">
          <div className="mx-auto flex max-w-2xl justify-center">
            <Button
              className="font-mono"
              disabled={!canStartAdventure || isGenerating}
              onClick={() => {
                console.log("🔘 Button clicked!", {
                  selectedSeed,
                  customPrompt,
                  canStartAdventure,
                });
                const prompt = selectedSeed || customPrompt.trim();
                console.log("📋 Resolved prompt:", prompt);
                if (prompt) {
                  console.log("✅ Calling handleStartAdventure");
                  handleStartAdventure(prompt);
                } else {
                  console.log("❌ No prompt available");
                }
              }}
              size="lg"
            >
              {isGenerating ? (
                <>&gt; Generating...</>
              ) : (
                <>&gt; Start Adventure</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
