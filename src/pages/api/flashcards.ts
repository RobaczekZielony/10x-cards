import type { APIRoute } from "astro";
import { z } from "zod";
import { FlashcardsService } from "../../lib/services/flashcards.service";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

// Disable prerendering for dynamic API route
export const prerender = false;

// Helper function to sanitize text
const sanitizeText = (text: string) => {
  return text
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[\u200B-\u200D\uFEFF]/g, ""); // Remove zero-width spaces
};

// Validation schema for individual flashcard
const createFlashcardSchema = z.object({
  front_text: z
    .string()
    .min(1, "Front text cannot be empty")
    .max(200, "Front text cannot exceed 200 characters")
    .transform(sanitizeText),
  back_text: z
    .string()
    .min(1, "Back text cannot be empty")
    .max(500, "Back text cannot exceed 500 characters")
    .transform(sanitizeText),
  source: z.enum(["manual", "ai-full", "ai-edited"], {
    errorMap: () => ({ message: "Invalid source type" }),
  }),
  generation_id: z.string().uuid("Invalid generation ID format").optional(),
});

// Validation schema for the request body
const createFlashcardsSchema = z.object({
  flashcards: z
    .array(createFlashcardSchema)
    .min(1, "At least one flashcard is required")
    .max(100, "Cannot create more than 100 flashcards at once"), // Reasonable limit to protect server resources
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { supabase } = locals;
    const flashcardsService = new FlashcardsService(supabase);

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createFlashcardsSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create flashcards using the service
    const response = await flashcardsService.createFlashcards(DEFAULT_USER_ID, validationResult.data.flashcards);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing flashcards creation:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
