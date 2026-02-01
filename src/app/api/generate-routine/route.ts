import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { buildRoutinePrompt } from "@/lib/ai/prompts";
import { getAIProvider } from "@/lib/ai/provider";
import type { Exercise, RoutineGenerationParams, GeneratedRoutine } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { params, exercises } = body as {
      params: RoutineGenerationParams;
      exercises: Exercise[];
    };

    if (!params || !exercises || exercises.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

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
