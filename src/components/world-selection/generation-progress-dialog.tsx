import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ras-sh/ui/dialog";
import { Spinner } from "~/components/spinner";
import { WORLD_FIELDS } from "~/lib/world-fields";

type GenerationProgressDialogProps = {
  isOpen: boolean;
  completedFields: Set<string>;
  currentField?: string;
  isInitialMessageComplete: boolean;
};

export function GenerationProgressDialog({
  isOpen,
  completedFields,
  currentField,
  isInitialMessageComplete,
}: GenerationProgressDialogProps) {
  const totalFields = WORLD_FIELDS.length + 1; // +1 for opening scene
  const completedCount =
    completedFields.size + (isInitialMessageComplete ? 1 : 0);
  const progressPercentage = Math.round((completedCount / totalFields) * 100);

  // Check if all world fields are complete
  const allWorldFieldsComplete = completedFields.size === WORLD_FIELDS.length;

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="max-w-xl rounded-none font-mono"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="font-mono text-xl text-zinc-100">
            &gt; Generating Your World
          </DialogTitle>
          <DialogDescription className="font-mono text-zinc-400">
            &gt; Creating your text adventure world...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Progress Bar - Text Adventure Style */}
          <div className="border border-zinc-800 bg-zinc-900/30 p-3">
            <div className="mb-2 flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>&gt; Progress</span>
              <span className="font-semibold text-zinc-300">
                {progressPercentage}%
              </span>
            </div>
            <div className="h-1 w-full bg-zinc-900">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* World Data */}
          <div>
            <h3 className="mb-2 font-mono font-semibold text-sm text-zinc-300">
              &gt; World Data:
            </h3>
            <div className="border border-zinc-800 bg-zinc-900/30 p-3 font-mono">
              <div className="space-y-1">
                {WORLD_FIELDS.map((field) => {
                  const isComplete = completedFields.has(field.key);
                  const isCurrent = currentField === field.key && !isComplete;
                  return (
                    <div
                      className="flex items-center gap-2 text-sm"
                      key={field.key}
                    >
                      <span className="shrink-0 whitespace-nowrap font-mono">
                        {isComplete ? (
                          <span className="text-green-500">[✓]</span>
                        ) : isCurrent ? (
                          <span className="whitespace-nowrap text-primary">
                            [<Spinner />]
                          </span>
                        ) : (
                          <span className="whitespace-nowrap text-zinc-700">
                            [ ]
                          </span>
                        )}
                      </span>
                      <span
                        className={`min-w-0 flex-1 ${
                          isComplete
                            ? "text-zinc-200"
                            : isCurrent
                              ? "text-zinc-300"
                              : "text-zinc-600"
                        }`}
                      >
                        {field.label}
                      </span>
                      {isCurrent && (
                        <span className="shrink-0 whitespace-nowrap text-xs text-zinc-500">
                          &gt; Generating...
                        </span>
                      )}
                    </div>
                  );
                })}
                {/* Opening Scene */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="shrink-0 whitespace-nowrap font-mono">
                    {isInitialMessageComplete ? (
                      <span className="text-green-500">[✓]</span>
                    ) : currentField === "openingScene" ? (
                      <span className="whitespace-nowrap text-primary">
                        [<Spinner />]
                      </span>
                    ) : (
                      <span className="whitespace-nowrap text-zinc-700">
                        [ ]
                      </span>
                    )}
                  </span>
                  <span
                    className={`min-w-0 flex-1 ${
                      isInitialMessageComplete
                        ? "text-zinc-200"
                        : currentField === "openingScene"
                          ? "text-zinc-300"
                          : "text-zinc-600"
                    }`}
                  >
                    Opening Scene
                  </span>
                  {currentField === "openingScene" && (
                    <span className="shrink-0 whitespace-nowrap text-xs text-zinc-500">
                      &gt; Generating...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completion Message */}
          {allWorldFieldsComplete &&
            isInitialMessageComplete &&
            !currentField && (
              <div className="border-zinc-800 border-t pt-3">
                <div className="flex items-center gap-2 border border-green-900/50 bg-green-900/10 p-3 font-mono text-sm">
                  <span className="min-w-0 flex-1 text-green-400">
                    &gt; World generation complete! Starting adventure...
                  </span>
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
