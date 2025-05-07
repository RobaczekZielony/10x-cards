import type { APIRoute } from "astro";
import { z } from "zod";
import type { CreateGenerationRequestDto } from "../../types";
import { GenerationService } from "../../lib/services/generation.service";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

export const prerender = false;

// Validation schema for the request body
const createGenerationSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Text must be at least 1000 characters")
    .max(10000, "Text cannot exceed 10000 characters"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Check authentication
    // const {
    //   data: { user },
    //   error: authError,
    // } = await locals.supabase.auth.getUser();

    // if (authError || !user) {
    //   return new Response(
    //     JSON.stringify({
    //       error: "Unauthorized",
    //       details: "You must be authenticated to use this endpoint",
    //     }),
    //     { status: 401 }
    //   );
    // }

    // 2. Parse and validate request body
    const body = (await request.json()) as CreateGenerationRequestDto;
    const validationResult = createGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: validationResult.error.errors,
        }),
        { status: 400 }
      );
    }

    // 3. Extract validated data and generate flashcards
    const { source_text } = validationResult.data;
    const generationService = new GenerationService(locals.supabase);
    const result = await generationService.generateFlashcards(DEFAULT_USER_ID, source_text);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
