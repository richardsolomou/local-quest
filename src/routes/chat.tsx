"use client";

import { useChat } from "@ai-sdk/react";
import type { BuiltInAIUIMessage } from "@built-in-ai/core";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChatInput } from "~/components/chat-input";
import { ChatMessages } from "~/components/chat-messages";
import { ModelDownloadBanner } from "~/components/model-download-banner";
import { ClientSideChatTransport } from "~/lib/client-side-chat-transport";
import { useWorldStore } from "~/stores/world-store";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

export default function Chat() {
  const { worldData, initialMessage } = useWorldStore();
  const [input, setInput] = useState("");
  const [modelDownload, setModelDownload] = useState<{
    status: "downloading" | "complete" | "error";
    progress: number;
    message: string;
  } | null>(null);

  const {
    error,
    status,
    sendMessage,
    messages,
    regenerate,
    stop,
    setMessages,
  } = useChat<BuiltInAIUIMessage>({
    transport: new ClientSideChatTransport(),
    onError(error) {
      toast.error(error.message);
    },
    onData: (dataPart) => {
      // Handle model download progress
      if (dataPart.type === "data-modelDownloadProgress") {
        setModelDownload({
          status: dataPart.data.status,
          progress: dataPart.data.progress ?? 0,
          message: dataPart.data.message,
        });
        // Clear the download banner when complete
        if (dataPart.data.status === "complete") {
          setTimeout(() => setModelDownload(null), 500);
        }
        return;
      }
      // Handle transient notifications
      if (dataPart.type === "data-notification") {
        if (dataPart.data.level === "error") {
          toast.error(dataPart.data.message);
        } else if (dataPart.data.level === "warning") {
          toast.warning(dataPart.data.message);
        } else {
          toast.info(dataPart.data.message);
        }
      }
    },
  });

  const hasAddedInitialRef = useRef(false);

  // Add initial message when it's available
  useEffect(() => {
    if (
      initialMessage &&
      messages.length === 0 &&
      !hasAddedInitialRef.current
    ) {
      console.log("Adding initial message to chat:", initialMessage);
      hasAddedInitialRef.current = true;
      setMessages([
        {
          id: `initial-${Date.now()}`,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: initialMessage,
            },
          ],
        },
      ]);
    }
  }, [initialMessage, messages.length, setMessages]);

  // Send a message
  const handleSubmit = () => {
    // Allow submission when ready, or after an error/stop (not during submit/stream)
    const canSubmit =
      input.trim() && status !== "submitted" && status !== "streaming";

    if (canSubmit) {
      // Track message submission
      window.umami?.track("message_submitted");

      sendMessage({
        text: input,
      });
      setInput("");
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background p-6">
      {/* Model Download Banner - Absolutely positioned */}
      {modelDownload && (
        <ModelDownloadBanner
          message={modelDownload.message}
          progress={modelDownload.progress}
          status={modelDownload.status}
        />
      )}

      {/* Text Adventure Style Container */}
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col font-mono">
        {/* Main Content - Scrollable */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center p-6">
              <div className="text-center">
                <p className="text-zinc-400">
                  &gt;{" "}
                  {worldData
                    ? "Preparing adventure..."
                    : "No world data found. Please select a world first."}
                </p>
              </div>
            </div>
          ) : (
            <ChatMessages
              error={error}
              messages={messages}
              onRegenerate={regenerate}
              status={status}
            />
          )}
        </div>

        {/* Bottom input area */}
        <div className="shrink-0 bg-background p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl">
              <ChatInput
                input={input}
                onInputChange={setInput}
                onSubmit={handleSubmit}
                status={status}
                stop={stop}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
