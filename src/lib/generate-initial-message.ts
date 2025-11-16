import { builtInAI } from "@built-in-ai/core";
import { streamObject } from "ai";
import { z } from "zod";
import type { WorldData } from "~/stores/world-store";

const initialMessageSchema = z.object({
  openingScene: z
    .string()
    .describe(
      "The opening scene of the text adventure. Write in second person ('you', 'your'). Keep it concise - 2-3 short paragraphs maximum. Set the stage, describe the starting location and initial situation, and present the player with their first meaningful choice or action."
    ),
});

export type InitialMessageProgress = {
  isComplete: boolean;
};

/**
 * Generates the initial message for the text adventure based on world data.
 * This creates the opening scene/story beginning.
 * @param worldData The world data to generate the initial message from
 * @param onProgress Optional callback to report progress
 */
export async function generateInitialMessage(
  worldData: WorldData,
  onProgress?: (progress: InitialMessageProgress) => void
): Promise<string> {
  const model = builtInAI();

  // Check availability and handle model download if needed
  const availability = await model.availability();
  if (availability !== "available") {
    await model.createSessionWithProgress(() => {
      // Progress callback
    });
  }

  const systemPrompt = `You are the narrator of a text adventure game.
Based on the world data provided, create a concise, engaging opening scene that:
1. Sets the stage by briefly describing the starting location and initial situation
2. Immerses the player with vivid but brief descriptions
3. Presents the player with their first meaningful choice or action
4. Maintains the tone and genre of the adventure

Write in second person ("you", "your"). Keep it SHORT - 2-3 brief paragraphs maximum. Be concise and get to the action quickly.`;

  const userPrompt = `Create the opening scene for this text adventure:

Title: ${worldData.title}
Setting: ${worldData.setting}
Starting Location: ${worldData.startingLocation}
Initial Situation: ${worldData.initialSituation}
Tone: ${worldData.tone}
Genre: ${worldData.genre}

${
  worldData.characters && worldData.characters.length > 0
    ? `\nCharacters nearby:\n${worldData.characters
        .map((c) => `- ${c.name}: ${c.description} (${c.role})`)
        .join("\n")}`
    : ""
}

${
  worldData.items && worldData.items.length > 0
    ? `\nItems of note:\n${worldData.items
        .map((i) => `- ${i.name}: ${i.description}`)
        .join("\n")}`
    : ""
}

Begin the adventure!`;

  console.log("🔧 Calling streamObject for initial message");
  const result = streamObject({
    model,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
    schema: initialMessageSchema,
  });

  // Track progress
  if (onProgress) {
    const progressPromise = (async () => {
      try {
        for await (const partialObject of result.partialObjectStream) {
          if (partialObject.openingScene) {
            const text =
              typeof partialObject.openingScene === "string"
                ? partialObject.openingScene.trim()
                : "";
            // Consider complete if we have at least 50 characters (for a short scene)
            const isComplete = text.length >= 50;
            onProgress({ isComplete });
            if (isComplete) {
              console.log("📊 Progress: Opening scene complete");
            }
          }
        }
      } catch (error) {
        console.error("Error in progress tracking:", error);
      }
    })();

    // Wait for both result and progress tracking
    const [finalResult] = await Promise.all([result.object, progressPromise]);
    console.log("✅ Generated initial message object:", finalResult);
    return finalResult.openingScene;
  }

  // If no progress callback, just wait for result
  const finalResult = await result.object;
  console.log("✅ Generated initial message object:", finalResult);
  return finalResult.openingScene;
}
