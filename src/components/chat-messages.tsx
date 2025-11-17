import type { BuiltInAIUIMessage } from "@built-in-ai/core";
import { Button } from "@ras-sh/ui/button";
import type { ChatStatus } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import { Response } from "~/components/ai-elements/response";
import { Spinner } from "~/components/spinner";

type ChatMessagesProps = {
  messages: BuiltInAIUIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  onRegenerate: () => void;
};

export function ChatMessages({
  messages,
  status,
  error,
  onRegenerate,
}: ChatMessagesProps) {
  return (
    <Conversation>
      <ConversationScrollButton data-umami-event="scroll_to_bottom_clicked" />
      <ConversationContent>
        <div className="space-y-6 p-6 pb-32 font-mono">
          {messages.map((message) => (
            <div className="space-y-2" key={message.id}>
              {/* Message Parts Content */}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div className="space-y-2" key={`${message.id}-${i}`}>
                        {message.role === "user" ? (
                          <div className="text-zinc-500">&gt; {part.text}</div>
                        ) : (
                          <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
                            <Response>{part.text}</Response>
                          </div>
                        )}
                      </div>
                    );
                  case "file":
                    if (part.mediaType?.startsWith("image/")) {
                      return (
                        <div className="mb-3" key={`${message.id}-${i}`}>
                          <img
                            alt={part.filename || "Uploaded image"}
                            className="max-w-md rounded-lg"
                            src={part.url}
                          />
                        </div>
                      );
                    }
                    if (part.mediaType?.startsWith("audio/")) {
                      return (
                        <div
                          className="mb-3 space-y-2"
                          key={`${message.id}-${i}`}
                        >
                          <audio
                            className="w-full max-w-md"
                            controls
                            src={part.url}
                          >
                            <track kind="captions" />
                            Your browser does not support the audio element.
                          </audio>
                          {part.filename && (
                            <p className="text-sm text-zinc-400">
                              {part.filename}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  default:
                    return null;
                }
              })}
            </div>
          ))}

          {/* Loading State */}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-zinc-500">
              <Spinner />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded border border-red-500/20 bg-red-500/10 p-4 font-mono">
              <p className="mb-3 text-red-400 text-sm">
                &gt; Error: An error occurred. Please try again.
              </p>
              <Button
                className="rounded-none font-mono"
                data-umami-event="message_regenerated"
                disabled={status === "streaming" || status === "submitted"}
                onClick={onRegenerate}
                size="sm"
                type="button"
              >
                Retry
              </Button>
              <pre className="mt-3 overflow-x-auto rounded border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-400">
                {error.message}
              </pre>
            </div>
          )}
        </div>
      </ConversationContent>
    </Conversation>
  );
}

export type { ChatMessagesProps };
