import { builtInAI } from "@built-in-ai/core";
import { generateObject } from "ai";
import { z } from "zod";

const promptAnalysisSchema = z.object({
  needsTransformation: z
    .boolean()
    .describe(
      "Whether the input needs to be transformed into a proper text adventure game prompt. Set to true if the input is a short description, game title, or concept that needs expansion. Set to false if it's already a complete prompt."
    ),
  transformedPrompt: z
    .string()
    .describe(
      "The transformed prompt ready for world generation. If needsTransformation is false, this should be the original input. If true, this should be a complete prompt starting with 'You are a text adventure game...' that captures the essence of the input."
    ),
});

/**
 * Uses LLM to intelligently analyze and transform user input into a proper text adventure game prompt.
 * The LLM determines if the input needs transformation and creates an appropriate prompt.
 * Follows the same pattern as generate-world.ts
 */
export async function transformPrompt(userInput: string): Promise<string> {
  const trimmed = userInput.trim();

  // Quick check: if it's clearly already a full prompt, return early
  if (
    trimmed.toLowerCase().startsWith("you are a text adventure game") ||
    trimmed.toLowerCase().startsWith("you are a text-based adventure game")
  ) {
    return trimmed;
  }

  const model = builtInAI();

  // Check availability and handle model download if needed
  let availability = await model.availability();
  if (availability !== "available") {
    // Create session with progress tracking
    await model.createSessionWithProgress(() => {
      // Progress callback - could be used for UI updates if needed
    });
    // Verify availability after session creation
    availability = await model.availability();
    if (availability !== "available") {
      throw new Error(
        `Model is not available after session creation. Status: ${availability}`
      );
    }
  }

  const systemPrompt = `You are a prompt analyzer for text adventure games.
Your job is to analyze user input and determine if it needs to be transformed into a proper text adventure game prompt.

A proper prompt should follow this structure and style:
- Start with "You are a text adventure game set in..." or "You are a text adventure game where..."
- Describe the setting, world, and atmosphere in detail
- Specify what role the player takes (adventurer, survivor, hero, etc.)
- Describe what elements to present (locations, encounters, mechanics, etc.)
- Include guidance on player choices and consequences
- Create an immersive experience with vivid descriptions
- Be 2-4 sentences long, detailed enough for world generation

If the input is already a complete prompt (starts with "You are a text adventure game..." and follows the structure above), set needsTransformation to false and return it as-is.

If the input is a short description, game title, concept, or incomplete prompt, set needsTransformation to true and create a complete prompt that:
- Follows the exact structure and style of the seed prompts
- Captures the essence, atmosphere, and key elements of the input
- Specifies the player's role and the world they'll explore
- Includes what to present (locations, encounters, mechanics)
- Mentions player choices and their impact
- Creates an immersive, engaging experience

Style guidelines:
- Use vivid, descriptive language
- Be specific about the world and setting
- Mention key mechanics or elements (magic, technology, survival, etc.)
- Emphasize player agency and meaningful choices
- Create a sense of adventure and discovery

Examples of good transformations:
- "pokemon red" → "You are a text adventure game set in the Pokémon world. The player is a Pokémon Trainer starting their journey, catching wild Pokémon, battling Gym Leaders, and exploring diverse regions filled with unique creatures. Present encounters with wild Pokémon, trainer battles, Pokémon Centers, and the thrill of discovery. Include type advantages, evolution mechanics, and the bond between trainer and Pokémon. Allow the player to build their team, explore routes and cities, and work toward becoming a Pokémon Champion. Create an adventure filled with friendship, strategy, and the wonder of discovering new Pokémon."
- "cyberpunk 2077" → "You are a text adventure game set in Cyberpunk 2077's Night City. The player is a mercenary, netrunner, or street kid navigating a dystopian future filled with cyberware, corporate power, and street gangs. Present chrome enhancements, hacking the Net, braindances, and the struggle between megacorporations. Include fixers, cyberpsychosis, the Afterlife bar, and the dark side of technology. Allow the player to make choices about their cyberware, allegiances, and how they survive in Night City. Create a gritty cyberpunk adventure where style and substance matter, and every choice has consequences in a world where humanity is being replaced by technology."`;

  console.log("🔧 Calling generateObject with model and schema");
  const { object: analysis } = await generateObject({
    model,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Analyze this input and transform it if needed:\n\n${trimmed}`,
      },
    ],
    schema: promptAnalysisSchema,
  });
  console.log("✅ generateObject completed, result:", analysis);

  if (
    !analysis.transformedPrompt ||
    analysis.transformedPrompt.trim().length === 0
  ) {
    throw new Error("LLM returned empty prompt");
  }

  return analysis.transformedPrompt;
}
