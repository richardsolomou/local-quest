import { Button } from "@ras-sh/ui/button";

type WorldSearchBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRandomSelect: () => void;
  disabled?: boolean;
};

export function WorldSearchBar({
  searchQuery,
  onSearchChange,
  onRandomSelect,
  disabled,
}: WorldSearchBarProps) {
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border border-zinc-800 bg-zinc-900/30 px-3 py-2 font-mono text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="> Search worlds..."
        type="text"
        value={searchQuery}
      />
      <Button
        className="h-10 shrink-0 font-mono"
        disabled={disabled}
        onClick={onRandomSelect}
        size="sm"
        type="button"
        variant="outline"
      >
        &gt; Random
      </Button>
    </div>
  );
}
