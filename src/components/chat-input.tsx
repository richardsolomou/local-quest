import type { UseChatHelpers } from "@ai-sdk/react";
import type { BuiltInAIUIMessage } from "@built-in-ai/core";
import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "~/components/ai-elements/prompt-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useBrowserAISupport } from "~/hooks/use-browser-ai-support";

type ChatInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  status: UseChatHelpers<BuiltInAIUIMessage>["status"];
  stop: UseChatHelpers<BuiltInAIUIMessage>["stop"];
  onClearConversation?: () => void;
  hasMessages?: boolean;
};

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  status,
  stop,
  onClearConversation,
  hasMessages,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevStatusRef = useRef(status);
  const browserSupportsModel = useBrowserAISupport();
  const isDisabled = browserSupportsModel === false;
  // Only disable inputs when submitting (not when streaming), so users can type next message
  const isInputDisabled = isDisabled || status === "submitted";

  // Autofocus the textarea after a message finishes
  useEffect(() => {
    if (
      prevStatusRef.current === "streaming" &&
      status === "ready" &&
      textareaRef.current
    ) {
      textareaRef.current.focus();
    }
    prevStatusRef.current = status;
  }, [status]);

  return (
    <div className="space-y-3">
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            autoFocus
            className="border-zinc-800 bg-zinc-900/30 font-mono text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20"
            disabled={isInputDisabled}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="&gt; Type your action..."
            ref={textareaRef}
            value={input}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <div className="flex items-center gap-1">
            {hasMessages && onClearConversation && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="font-mono"
                    data-umami-event="clear_conversation_button_clicked"
                    disabled={isInputDisabled}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="font-mono">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all messages in the current conversation.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      data-umami-event="conversation_cleared"
                      onClick={onClearConversation}
                    >
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <PromptInputSubmit
            className="font-mono"
            data-umami-event={
              status === "submitted" || status === "streaming"
                ? "message_stopped"
                : undefined
            }
            disabled={
              status === "submitted" || status === "streaming"
                ? false
                : isDisabled || !input.trim()
            }
            onClick={
              status === "submitted" || status === "streaming"
                ? stop
                : undefined
            }
            status={status}
            type={
              status === "submitted" || status === "streaming"
                ? "button"
                : "submit"
            }
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
