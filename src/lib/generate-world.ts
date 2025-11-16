import { builtInAI } from "@built-in-ai/core";
import { streamObject } from "ai";
import { z } from "zod";
import type { WorldData } from "~/stores/world-store";

const worldDataSchema = z.object({
  title: z.string().describe("The title of the text adventure world"),
  description: z
    .string()
    .describe(
      "A brief 2-3 sentence description of the world and its atmosphere"
    ),
  setting: z
    .string()
    .describe(
      "A detailed description of the world setting, including time period, location, and key environmental details"
    ),
  startingLocation: z
    .string()
    .describe("The specific location where the player begins their adventure"),
  initialSituation: z
    .string()
    .describe(
      "The initial situation or scenario the player finds themselves in when the adventure begins"
    ),
  characters: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        role: z.string(),
      })
    )
    .optional()
    .describe("Key characters the player might encounter"),
  items: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .optional()
    .describe("Important items or objects in the world"),
  goals: z
    .array(z.string())
    .optional()
    .describe("Potential goals or objectives for the player"),
  tone: z
    .string()
    .describe(
      "The overall tone of the adventure (e.g., 'dark and mysterious', 'lighthearted and adventurous', 'tense and suspenseful')"
    ),
  genre: z
    .string()
    .describe(
      "The genre of the adventure (e.g., 'fantasy', 'sci-fi', 'mystery', 'horror')"
    ),
});

export type ProgressState = {
  completedFields: Set<string>;
  currentField?: string;
};

/**
 * Generates structured world data from a seed prompt using the browser's built-in AI.
 * This is an off-screen LLM call that returns structured data, not part of the chat.
 * @param seedPrompt The seed prompt to generate world data from
 * @param onProgress Optional callback to report progress as fields are generated
 */
export async function generateWorldData(
  seedPrompt: string,
  onProgress?: (progress: ProgressState) => void
): Promise<WorldData> {
  const model = builtInAI();

  // Check availability and handle model download if needed
  const availability = await model.availability();
  if (availability !== "available") {
    // Create session with progress tracking
    await model.createSessionWithProgress(() => {
      // Progress callback - could be used for UI updates if needed
    });
  }

  const systemPrompt = `You are a world-building assistant for text adventure games.
Generate a rich, detailed world based on the seed prompt provided.
Create an immersive setting with interesting locations, characters, and situations that will make for an engaging text adventure experience.`;

  console.log("🔧 Calling streamObject with model and schema");
  const result = streamObject({
    model,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Create a text adventure world based on this seed prompt:\n\n${seedPrompt}`,
      },
    ],
    schema: worldDataSchema,
  });

  // Track progress as fields get populated (in parallel with waiting for result)
  const completedFields = new Set<string>();
  let lastProgressUpdate = Date.now();

  // Helper function to check if a field is complete
  const isFieldComplete = (value: unknown): boolean => {
    if (value === undefined || value === null) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    if (typeof value === "object") {
      return Object.keys(value).length > 0;
    }
    return false;
  };

  // Helper function to update completed fields from an object
  const updateCompletedFields = (
    obj: Record<string, unknown>,
    fields: string[]
  ): void => {
    for (const field of fields) {
      const value = obj[field];
      if (isFieldComplete(value) && !completedFields.has(field)) {
        completedFields.add(field);
        console.log(`✅ Field completed: ${field}`);
      }
    }
  };

  const allFields = [
    "title",
    "description",
    "setting",
    "startingLocation",
    "initialSituation",
    "tone",
    "genre",
    "characters",
    "items",
    "goals",
  ];

  const progressPromise = (async () => {
    try {
      for await (const partialObject of result.partialObjectStream) {
        const now = Date.now();
        // Update progress every 200ms for smoother updates
        if (now - lastProgressUpdate > 200 && onProgress) {
          updateCompletedFields(partialObject, allFields);

          // Find the current field being worked on (first incomplete required field, then optional)
          const requiredFields = [
            "title",
            "description",
            "setting",
            "startingLocation",
            "initialSituation",
            "tone",
            "genre",
          ];
          const optionalFields = ["characters", "items", "goals"];

          let currentField = requiredFields.find(
            (field) => !completedFields.has(field)
          );
          if (!currentField) {
            currentField = optionalFields.find(
              (field) => !completedFields.has(field)
            );
          }

          onProgress({
            completedFields: new Set(completedFields),
            currentField,
          });
          lastProgressUpdate = now;
        }
      }
    } catch (error) {
      console.error("Error in progress tracking:", error);
    }
  })();

  // Wait for the complete object (and progress tracking)
  const [worldData] = await Promise.all([result.object, progressPromise]);

  // Final update to ensure all fields are marked complete from the final object
  if (onProgress) {
    updateCompletedFields(worldData as Record<string, unknown>, allFields);
    console.log("📊 Final completed fields:", Array.from(completedFields));
    onProgress({
      completedFields: new Set(completedFields),
      currentField: undefined, // All done
    });
  }
  console.log("✅ streamObject completed, result:", worldData);

  return worldData as WorldData;
}
