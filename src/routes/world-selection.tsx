"use client";

import { Button } from "@ras-sh/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ras-sh/ui/dialog";
import { Textarea } from "@ras-sh/ui/textarea";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BrowserUnsupportedDialog } from "~/components/browser-unsupported-dialog";
import { Footer } from "~/components/footer";
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
      "You are a text adventure game set in a medieval fantasy world. The player is a brave adventurer exploring a kingdom filled with magic, dragons, ancient ruins, and mysterious forests. Present vivid descriptions of castles, taverns, magical artifacts, and dangerous quests. Allow the player to make choices that affect their reputation, alliances, and the fate of the realm. Create an immersive world where magic feels real and every path leads to adventure.",
  },
  {
    title: "Space Exploration",
    description: "Explore the cosmos and discover alien worlds",
    prompt:
      "You are a text adventure game set in space. The player is a space explorer, starship captain, or alien diplomat discovering new planets, encountering strange civilizations, and navigating the vastness of the cosmos. Present epic discoveries, first contact scenarios, and cosmic mysteries. Make each planet unique with its own ecology, culture, and dangers. Create a sense of wonder and scale where the player's choices shape interstellar relations.",
  },
  {
    title: "Post-Apocalyptic",
    description: "Survive in a world after the collapse",
    prompt:
      "You are a text adventure game set in a post-apocalyptic world. The player is a survivor navigating a dangerous wasteland, scavenging resources, encountering other survivors, and making difficult moral choices. Present a tense, atmospheric world where every decision matters for survival. Include settlements, raiders, mutated creatures, and remnants of the old world. Create moral dilemmas where the player must balance survival with humanity.",
  },
  {
    title: "Horror Survival",
    description: "Survive supernatural horrors and dark mysteries",
    prompt:
      "You are a text adventure game set in a horror survival scenario. The player is trapped in a haunted location, cursed town, or supernatural realm where dark forces lurk. Present atmospheric descriptions, creeping dread, and moments of terror. Include sanity mechanics, limited resources, and choices between fight, flight, or investigation. Create a tense atmosphere where the player must balance survival with uncovering the truth behind the horror. Make fear palpable and every shadow potentially dangerous.",
  },
  {
    title: "Time Travel",
    description: "Navigate through different eras and alter history",
    prompt:
      "You are a text adventure game about time travel. The player is a time traveler navigating different historical periods, from ancient civilizations to future dystopias. Present paradoxes, historical accuracy, and the consequences of changing the past. Include time machines, temporal anomalies, and the butterfly effect. Allow the player to witness key historical events and make choices that ripple through time. Create a complex narrative where cause and effect span centuries.",
  },
  {
    title: "Steampunk",
    description: "Victorian era with steam-powered technology and airships",
    prompt:
      "You are a text adventure game set in a steampunk world. The player is an inventor, airship captain, or adventurer navigating a Victorian-era world enhanced with steam-powered technology, clockwork automatons, and brass machinery. Present airships, steam engines, mechanical marvels, and gaslit streets. Include secret societies, industrial espionage, and the clash between tradition and innovation. Allow the player to craft inventions, navigate social intrigue, and explore a world where steam power has revolutionized everything. Create an adventure filled with mechanical wonders, Victorian aesthetics, and the romance of the industrial age.",
  },
  {
    title: "Wild West",
    description: "Frontier adventure in the American Old West",
    prompt:
      "You are a text adventure game set in the Wild West. The player is a gunslinger, sheriff, outlaw, or frontier settler navigating dusty towns, dangerous trails, and lawless territories. Present saloons, gold rushes, cattle drives, and showdowns at high noon. Include Native American encounters, railroad expansion, and the clash between civilization and wilderness. Allow the player to make choices about honor, survival, and justice on the frontier. Create a world where every decision matters and the line between lawman and outlaw is thin.",
  },
  {
    title: "Pirate Adventure",
    description: "Sail the high seas and search for treasure",
    prompt:
      "You are a text adventure game set in the Golden Age of Piracy. The player is a pirate captain, privateer, or naval officer navigating the Caribbean and other seas, searching for treasure, battling other ships, and exploring tropical islands. Present ship combat, treasure maps, hidden coves, and encounters with legendary pirates. Include crew management, naval battles, and the freedom of the open sea. Allow the player to build their reputation, amass treasure, and make choices between piracy and honor. Create swashbuckling adventures filled with danger, discovery, and the romance of life on the high seas.",
  },
  {
    title: "Superhero",
    description: "Become a hero with superpowers and fight crime",
    prompt:
      "You are a text adventure game where the player is a superhero with superpowers navigating a modern city filled with crime, supervillains, and moral dilemmas. Present secret identities, superpowers, crime-fighting, and the responsibility that comes with great power. Include supervillains, team-ups with other heroes, and the struggle to balance a normal life with heroics. Allow the player to develop their powers, choose their moral code, and face challenges that test their character. Create epic adventures where the player must decide what kind of hero they want to be and how far they're willing to go to protect others.",
  },
  {
    title: "Zombie Apocalypse",
    description: "Survive the undead hordes in a world overrun",
    prompt:
      "You are a text adventure game set in a zombie apocalypse. The player is a survivor navigating a world overrun by the undead, scavenging resources, finding shelter, and making difficult choices to stay alive. Present zombie encounters, safe havens, resource management, and the constant threat of infection. Include other survivors (both allies and threats), moral dilemmas about survival, and the psychological toll of the apocalypse. Allow the player to make choices about who to trust, how to survive, and whether to help others or look out for themselves. Create a tense survival experience where every decision could mean the difference between life and death.",
  },
  {
    title: "Pokémon",
    description: "Become a Pokémon Trainer and explore the world",
    prompt:
      "You are a text adventure game set in the Pokémon world. The player is a Pokémon Trainer starting their journey, catching wild Pokémon, battling Gym Leaders, and exploring diverse regions filled with unique creatures. Present encounters with wild Pokémon, trainer battles, Pokémon Centers, and the thrill of discovery. Include type advantages, evolution mechanics, and the bond between trainer and Pokémon. Allow the player to build their team, explore routes and cities, and work toward becoming a Pokémon Champion. Create an adventure filled with friendship, strategy, and the wonder of discovering new Pokémon.",
  },
  {
    title: "Assassin's Creed",
    description: "Historical adventures as an Assassin across different eras",
    prompt:
      "You are a text adventure game set in the Assassin's Creed universe. The player is an Assassin navigating historical periods like Renaissance Italy, Revolutionary America, Ancient Egypt, or Viking Age England. Present parkour movement, stealth assassinations, historical landmarks, and the conflict between Assassins and Templars. Include hidden blades, eagle vision, historical figures, and the Animus technology that connects past and present. Allow the player to explore cities, climb iconic structures, complete missions, and uncover ancient conspiracies. Create immersive historical adventures where the player's actions shape both the past and the present.",
  },
  {
    title: "Rick and Morty",
    description: "Interdimensional adventures with science, aliens, and chaos",
    prompt:
      "You are a text adventure game set in the Rick and Morty universe. The player is Rick Sanchez, Morty Smith, or another character going on wild interdimensional adventures. Present bizarre alien worlds, crazy scientific inventions, portal gun travel, and absurd situations. Include dark humor, existential themes, multiverse hopping, and encounters with strange creatures and alternate versions of characters. Allow the player to use Rick's gadgets, visit infinite dimensions, and make choices that lead to hilarious or horrifying consequences. Create chaotic adventures filled with science, sarcasm, and the unpredictable nature of infinite realities.",
  },
  {
    title: "The Witcher",
    description: "Monster hunting in a dark fantasy world",
    prompt:
      "You are a text adventure game set in the Witcher universe. The player is a witcher, a mutated monster hunter navigating a dark fantasy world filled with dangerous creatures, political intrigue, and moral ambiguity. Present contracts to hunt monsters, choices between lesser evils, alchemy and potions, and encounters with sorceresses, kings, and common folk. Include sword combat, signs (magic), and the complex politics of the Northern Kingdoms. Allow the player to make choices that affect their reputation and the world around them. Create a gritty, mature fantasy adventure where there are no perfect solutions.",
  },
  {
    title: "The Lord of the Rings",
    description: "Epic fantasy adventures in Middle-earth",
    prompt:
      "You are a text adventure game set in Middle-earth from The Lord of the Rings. The player is a hobbit, elf, dwarf, human, or other race navigating the vast world of Tolkien's creation. Present journeys across diverse landscapes, encounters with iconic races and creatures, and the struggle against dark forces. Include the One Ring, magical artifacts, ancient languages, and the rich history of Middle-earth. Allow the player to explore the Shire, Rivendell, Moria, and other iconic locations. Create epic adventures filled with heroism, friendship, and the battle between good and evil.",
  },
  {
    title: "Fallout",
    description: "Post-nuclear wasteland survival with retro-futuristic tech",
    prompt:
      "You are a text adventure game set in the Fallout universe. The player is a Vault Dweller or wasteland survivor navigating a post-nuclear America filled with radiation, mutants, raiders, and retro-futuristic technology. Present Vault-Tec vaults, settlements, the Brotherhood of Steel, Super Mutants, and ghouls. Include V.A.T.S. combat system, S.P.E.C.I.A.L. stats, Pip-Boy interface, and the retro-1950s aesthetic. Allow the player to make choices affecting karma, factions, and the wasteland's future. Create a darkly humorous adventure where the player must survive and thrive in a world destroyed by nuclear war.",
  },
  {
    title: "Marvel Superheroes",
    description: "Become a hero in the Marvel universe",
    prompt:
      "You are a text adventure game set in the Marvel universe. The player is a superhero, mutant, or enhanced individual navigating a world filled with heroes, villains, and cosmic threats. Present encounters with iconic Marvel characters, superpowers, secret identities, and the responsibility that comes with great power. Include Avengers, X-Men, Spider-Man's world, cosmic entities, and street-level heroes. Allow the player to develop their powers, form alliances, and face moral dilemmas. Create epic adventures where the player's choices affect the Marvel universe and determine what kind of hero they become.",
  },
  {
    title: "The Elder Scrolls",
    description: "Fantasy RPG adventures in Tamriel",
    prompt:
      "You are a text adventure game set in the Elder Scrolls universe, specifically in Tamriel. The player is an adventurer exploring provinces like Skyrim, Cyrodiil, or Morrowind, encountering dragons, Daedric princes, and ancient ruins. Present the Thu'um (Dragon Shouts), magic schools, guilds (Thieves, Mages, Fighters), and the rich lore of Tamriel. Include races like Nords, Elves, Khajiit, and Argonians. Allow the player to develop skills, complete quests, and shape their destiny. Create immersive fantasy adventures filled with exploration, magic, and the freedom to be whoever you want to be.",
  },
  {
    title: "Cyberpunk 2077",
    description: "Night City adventures with cyberware and corporate intrigue",
    prompt:
      "You are a text adventure game set in Cyberpunk 2077's Night City. The player is a mercenary, netrunner, or street kid navigating a dystopian future filled with cyberware, corporate power, and street gangs. Present chrome enhancements, hacking the Net, braindances, and the struggle between megacorporations. Include fixers, cyberpsychosis, the Afterlife bar, and the dark side of technology. Allow the player to make choices about their cyberware, allegiances, and how they survive in Night City. Create a gritty cyberpunk adventure where style and substance matter, and every choice has consequences in a world where humanity is being replaced by technology.",
  },
  {
    title: "Dungeons & Dragons",
    description: "Classic tabletop RPG adventures with classes and races",
    prompt:
      "You are a text adventure game set in a Dungeons & Dragons campaign world like the Forgotten Realms. The player is an adventurer choosing from classic D&D classes (fighter, wizard, rogue, cleric, etc.) and races (human, elf, dwarf, halfling, etc.). Present dungeon crawls, role-playing encounters, combat with initiative and dice rolls, and the classic D&D mechanics. Include magic spells, magical items, alignment choices, and the freedom to approach problems creatively. Allow the player to level up, gain new abilities, and form a party with other adventurers. Create classic fantasy adventures where creativity, strategy, and role-playing lead to epic stories.",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [completedFields, setCompletedFields] = useState<Set<string>>(
    new Set()
  );
  const [currentField, setCurrentField] = useState<string | undefined>();
  const [isInitialMessageComplete, setIsInitialMessageComplete] =
    useState(false);
  const { setWorldData, setSeedPrompt, setInitialMessage } = useWorldStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Scroll to selected item when it changes
  useEffect(() => {
    if (!selectedSeed) {
      return;
    }
    if (!scrollContainerRef.current) {
      return;
    }
    // Small delay to ensure DOM has updated after search query changes
    const timeoutId = setTimeout(() => {
      const selectedButton = scrollContainerRef.current?.querySelector(
        `[data-seed-prompt="${CSS.escape(selectedSeed)}"]`
      ) as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [selectedSeed]);

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

            {/* Seed Prompts */}
            <div className="space-y-3">
              <h2 className="font-semibold text-lg text-zinc-300">
                &gt; Available Worlds:
              </h2>
              {/* Search Input */}
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-zinc-800 bg-zinc-900/30 px-3 py-2 font-mono text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isGenerating}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="> Search worlds..."
                  type="text"
                  value={searchQuery}
                />
                <Button
                  className="h-10 shrink-0 rounded-none font-mono"
                  disabled={isGenerating}
                  onClick={handleRandomSelect}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  &gt; Random
                </Button>
              </div>
              {/* Scrollable List */}
              <div
                className="max-h-96 space-y-2 overflow-y-auto pr-2"
                ref={scrollContainerRef}
              >
                {filteredSeedPrompts.length > 0 ? (
                  filteredSeedPrompts.map((seed) => {
                    const originalIndex = SEED_PROMPTS.findIndex(
                      (s) => s.prompt === seed.prompt
                    );
                    return (
                      <button
                        className={`w-full border p-4 text-left font-mono transition-all ${
                          selectedSeed === seed.prompt
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50"
                        }
                            ${isGenerating ? "cursor-not-allowed opacity-50" : ""}
                          `}
                        data-seed-prompt={seed.prompt}
                        disabled={isGenerating}
                        key={originalIndex}
                        onClick={() => handleSeedSelect(seed.prompt)}
                        type="button"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-500">
                            {selectedSeed === seed.prompt
                              ? "[✓]"
                              : `[${originalIndex + 1}]`}
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
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-sm text-zinc-500">
                    &gt; No worlds found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-zinc-800 border-t pt-6">
              <h2 className="mb-3 font-semibold text-lg text-zinc-300">
                &gt; Custom World:
              </h2>
              <Textarea
                className="min-h-32 resize-none rounded-none border-zinc-800 bg-background! font-mono text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isGenerating}
                onChange={(e) => handleCustomPromptChange(e.target.value)}
                placeholder="Describe your own text adventure world...&#10;&#10;Example:&#10;You are a text adventure game set in a steampunk Victorian London where the player is an inventor solving mysteries..."
                value={customPrompt}
              />
            </div>

            {/* Start Adventure Button */}
            <div className="flex justify-center pt-4">
              <Button
                className="w-full rounded-none font-mono md:w-auto"
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

          {/* Generation Progress Dialog */}
          <Dialog open={isGenerating}>
            <DialogContent
              className="max-w-md rounded-none font-mono"
              showCloseButton={false}
            >
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
                      const isCurrent =
                        currentField === field.key && !isComplete;
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
                        <span className="animate-pulse text-zinc-400">
                          [...]
                        </span>
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
