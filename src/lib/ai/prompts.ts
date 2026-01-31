import type { Exercise, RoutineGenerationParams } from "@/types";

export function buildRoutinePrompt(
  params: RoutineGenerationParams,
  exercises: Exercise[]
): string {
  const { userWeight, userHeight, unitPreference, workoutType, intensity, duration } = params;

  const exerciseList = exercises
    .map((e) => `- ${e.id}: ${e.name} (${e.category}, ${e.equipment}, targets: ${e.muscleGroups.join(", ")})`)
    .join("\n");

  const intensityGuide = {
    Heavy: "Focus on compound movements with lower reps (4-6) and heavier weights. Include adequate rest between sets.",
    Medium: "Balance of compound and isolation exercises with moderate reps (8-12) and moderate weights.",
    Light: "Higher reps (12-15), lighter weights, more isolation exercises. Good for recovery or beginners.",
  };

  const workoutTypeGuide: Record<string, string> = {
    Push: "Focus on chest, shoulders, and triceps exercises.",
    Pull: "Focus on back and biceps exercises.",
    Legs: "Focus on quadriceps, hamstrings, glutes, and calves.",
    Upper: "Combine push and pull movements for a complete upper body workout.",
    Lower: "Focus on all leg muscles including quads, hamstrings, glutes, and calves.",
    FullBody: "Include exercises for all major muscle groups in one session.",
  };

  const userStats = userWeight && userHeight
    ? `User stats: ${userWeight}${unitPreference}, ${userHeight}cm height.`
    : "User stats not provided - use moderate weights as starting point.";

  return `You are a professional fitness trainer creating a workout routine.

${userStats}

Create a ${workoutType} workout routine with the following parameters:
- Workout Type: ${workoutType} - ${workoutTypeGuide[workoutType]}
- Intensity: ${intensity} - ${intensityGuide[intensity]}
- Target Duration: ${duration} minutes

AVAILABLE EXERCISES (you MUST only use exercises from this list):
${exerciseList}

INSTRUCTIONS:
1. Select 4-8 exercises appropriate for a ${workoutType} workout
2. Only use exercise IDs from the list above
3. Assign sets, reps, and starting weight based on intensity level
4. Weight should be in ${unitPreference}
5. For ${intensity} intensity: ${intensityGuide[intensity]}
6. Total workout time including rest should be approximately ${duration} minutes

Generate a workout routine with a creative but descriptive name.

IMPORTANT: You must respond with valid JSON only, no other text. Use this exact format:
{
  "name": "Routine Name Here",
  "exercises": [
    {
      "exerciseId": "exercise-id-from-list",
      "exerciseName": "Exercise Name",
      "sets": 3,
      "reps": 10,
      "weight": 20
    }
  ]
}`;
}

export const routineResponseSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "A creative name for the workout routine" },
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          exerciseId: { type: "string", description: "The exercise ID from the provided list" },
          exerciseName: { type: "string", description: "The exercise name" },
          sets: { type: "number", description: "Number of sets" },
          reps: { type: "number", description: "Number of reps per set" },
          weight: { type: "number", description: "Weight in the user's preferred unit" },
        },
        required: ["exerciseId", "exerciseName", "sets", "reps", "weight"],
      },
    },
  },
  required: ["name", "exercises"],
} as const;
