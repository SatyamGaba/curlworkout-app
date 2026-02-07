import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { buildRoutinePrompt } from "@/lib/ai/prompts";
import { getAIProvider } from "@/lib/ai/provider";
import type { GeneratedRoutine } from "@/types";

const requestSchema = z.object({
  params: z.object({
    userWeight: z.number().nullable(),
    userHeight: z.number().nullable(),
    unitPreference: z.enum(["kg", "lbs"]),
    workoutType: z.enum(["Push", "Pull", "Legs", "Upper", "Lower", "FullBody"]),
    intensity: z.enum(["Heavy", "Medium", "Light"]),
    duration: z.number().positive(),
  }),
  exercises: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.enum(["Push", "Pull", "Legs", "Core"]),
      muscleGroups: z.array(z.string()),
      equipment: z.enum(["Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight", "Other"]),
    })
  ).min(1, "At least one exercise is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      const message = parseResult.error.errors.map((e) => e.message).join("; ");
      return NextResponse.json(
        { error: `Invalid request: ${message}` },
        { status: 400 }
      );
    }

    const { params, exercises } = parseResult.data;

    const prompt = buildRoutinePrompt(params, exercises);
    const provider = getAIProvider();

    let model;
    if (provider === "google") {
      model = google("gemini-2.5-flash");
    } else {
      model = openai("gpt-4o-mini");
    }

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 5000,
    });

    // Parse the JSON response
    let routine: GeneratedRoutine;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      routine = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Validate the routine has required fields
    if (!routine.name || !routine.exercises || routine.exercises.length === 0) {
      return NextResponse.json(
        { error: "Invalid routine generated" },
        { status: 500 }
      );
    }

    // Validate exercise IDs exist in the provided list
    const exerciseIds = new Set(exercises.map((e) => e.id));
    const validExercises = routine.exercises.filter((e) =>
      exerciseIds.has(e.exerciseId)
    );

    if (validExercises.length === 0) {
      return NextResponse.json(
        { error: "No valid exercises in generated routine" },
        { status: 500 }
      );
    }

    routine.exercises = validExercises;

    return NextResponse.json({ routine });
  } catch (error) {
    console.error("Error generating routine:", error);
    return NextResponse.json(
      { error: "Failed to generate routine" },
      { status: 500 }
    );
  }
}
