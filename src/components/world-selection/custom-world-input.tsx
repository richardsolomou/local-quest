import { Textarea } from "@ras-sh/ui/textarea";

type CustomWorldInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function CustomWorldInput({
  value,
  onChange,
  disabled,
}: CustomWorldInputProps) {
  return (
    <div className="border-zinc-800 border-t pt-6">
      <h2 className="mb-3 font-semibold text-lg text-zinc-300">
        &gt; Custom World:
      </h2>
      <Textarea
        className="min-h-32 resize-none rounded-none border-zinc-800 bg-background! font-mono text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your own text adventure world...&#10;&#10;Examples:&#10;• star wars&#10;• harry potter&#10;• minecraft survival&#10;• zelda breath of the wild&#10;• final fantasy"
        value={value}
      />
    </div>
  );
}
