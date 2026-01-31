import type { Exercise, RoutineGenerationParams, GeneratedRoutine } from "@/types";

export interface AIProvider {
  generateRoutine(
    params: RoutineGenerationParams,
    exercises: Exercise[]
  ): Promise<GeneratedRoutine>;
}

export type AIProviderType = "openai" | "google";

export function getAIProvider(): AIProviderType {
  const provider = process.env.AI_PROVIDER as AIProviderType;
  return provider === "google" ? "google" : "openai";
}
