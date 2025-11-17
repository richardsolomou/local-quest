type SeedPromptItemProps = {
  seed: { title: string; description: string; prompt: string };
  index: number;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

export function SeedPromptItem({
  seed,
  index,
  isSelected,
  disabled,
  onSelect,
}: SeedPromptItemProps) {
  return (
    <button
      className={`w-full border p-4 text-left font-mono transition-all ${
        isSelected
          ? "border-primary bg-primary/10 text-primary"
          : "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50"
      }
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      data-seed-prompt={seed.prompt}
      disabled={disabled}
      onClick={() => onSelect(seed.prompt)}
      type="button"
    >
      <div className="flex items-start gap-2">
        <span className={isSelected ? "text-green-500" : "text-zinc-500"}>
          {isSelected ? "[✓]" : `[${index + 1}]`}
        </span>
        <div className="flex-1">
          <div className="font-semibold text-sm">{seed.title}</div>
          <div className="mt-1 text-xs text-zinc-400">{seed.description}</div>
        </div>
      </div>
    </button>
  );
}
