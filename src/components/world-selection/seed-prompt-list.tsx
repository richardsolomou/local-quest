import { useEffect, useRef } from "react";
import { SEED_PROMPTS } from "~/lib/seed-prompts";
import { SeedPromptItem } from "./seed-prompt-item";
import { WorldSearchBar } from "./world-search-bar";

type SeedPromptListProps = {
  filteredSeedPrompts: Array<{
    title: string;
    description: string;
    prompt: string;
  }>;
  searchQuery: string;
  selectedSeed: string | null;
  onSearchChange: (value: string) => void;
  onRandomSelect: () => void;
  onSeedSelect: (prompt: string) => void;
  disabled?: boolean;
};

export function SeedPromptList({
  filteredSeedPrompts,
  searchQuery,
  selectedSeed,
  onSearchChange,
  onRandomSelect,
  onSeedSelect,
  disabled,
}: SeedPromptListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="space-y-3">
      <h2 className="font-semibold text-lg text-zinc-300">
        &gt; Available Worlds:
      </h2>
      <WorldSearchBar
        disabled={disabled}
        onRandomSelect={onRandomSelect}
        onSearchChange={onSearchChange}
        searchQuery={searchQuery}
      />
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
              <SeedPromptItem
                disabled={disabled}
                index={originalIndex}
                isSelected={selectedSeed === seed.prompt}
                key={originalIndex}
                onSelect={onSeedSelect}
                seed={seed}
              />
            );
          })
        ) : (
          <div className="py-8 text-center text-sm text-zinc-500">
            &gt; No worlds found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
