# CurlWorkout App - MVP Specification

## Overview

CurlWorkout is an AI-powered gym workout tracking application similar to Hevy and Strong, but simplified for quick MVP delivery. Users can generate workout routines using AI based on their fitness profile, track workouts in real-time, and view their workout history.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Authentication | Firebase Authentication (Google Sign-in) |
| Database | Firestore |
| AI | Provider-agnostic layer (OpenAI/Gemini via Vercel AI SDK) |

---

## Core Features

### 1. Authentication

- Google Sign-in only (Firebase Auth)
- Auto-create user profile document on first login
- Protected routes for authenticated users
- Redirect unauthenticated users to login page

### 2. User Profile & Settings

**Stored Data:**
- `displayName` - from Google account
- `email` - from Google account
- `photoURL` - from Google account
- `weight` - user input (number)
- `height` - user input (number)
- `unitPreference` - `kg` | `lbs`
- `createdAt` - timestamp
- `updatedAt` - timestamp

**Settings Page:**
- Update weight and height
- Toggle unit preference (kg/lbs)

### 3. AI Routine Generation

**User Inputs:**
| Input | Options |
|-------|---------|
| Workout Type | `Push` \| `Pull` \| `Legs` \| `Upper` \| `Lower` \| `FullBody` |
| Intensity | `Heavy` \| `Medium` \| `Light` |
| Duration | `30min` \| `1hr` \| `2hr` \| `custom` |

**AI Output:**
- Routine name (auto-generated, user can edit)
- List of exercises selected from predefined database
- Each exercise includes: `exerciseId`, `exerciseName`, `sets`, `reps`, `weight`

**AI Prompt Context:**
- User's weight and height from profile
- Selected workout type, intensity, duration
- Full exercise database for AI to pick from

### 4. Predefined Exercise Database

Seed Firestore with ~50-60 common exercises.

**Exercise Schema:**
```typescript
interface Exercise {
  id: string;
  name: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Core';
  muscleGroups: string[];
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Other';
}
```

**Examples:**
- Bench Press (Push, Chest/Triceps, Barbell)
- Squat (Legs, Quadriceps/Glutes, Barbell)
- Deadlift (Pull, Back/Hamstrings, Barbell)
- Lat Pulldown (Pull, Back/Biceps, Cable)

### 5. Routine Management (CRUD)

| Operation | Description |
|-----------|-------------|
| **Create** | Via AI generation only (MVP) |
| **Read** | View saved routines list, view routine details |
| **Update** | Edit routine name, exercise order, sets/reps/weight |
| **Delete** | Remove routine from user's collection |

### 6. Workout Session

**Flow:**
1. User selects a saved routine
2. Clicks "Start Workout"
3. Timer starts counting up
4. User works through exercises
5. Marks sets/exercises as complete
6. Clicks "Finish Workout"
7. Session saved to history

**UI Components:**
- **Header:** Routine name, total duration timer (counts up from 0:00)
- **Exercise Cards:** Condensed view showing exercise name + sets/reps summary
- **Expandable Detail:** Click card to expand and see all sets with reps/weight
- **Inline Editing:** Edit sets, reps, weight during workout
- **Completion Toggle:** Checkbox/tick to mark each set or exercise done
- **Finish Button:** Floating button to end workout and save to history

### 7. Workout History

**Stored Data per Workout:**
```typescript
interface WorkoutHistory {
  id: string;
  routineId: string;
  routineName: string;
  workoutType: WorkoutType;
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number; // in seconds
  exercises: WorkoutExercise[];
  createdAt: Timestamp;
}

interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: {
    reps: number;
    weight: number;
    completed: boolean;
  }[];
}
```

**History Features:**
- List view of past workouts
- Filter by date range
- Filter by workout type (Push/Pull/Legs/Upper/Lower/FullBody)
- View detailed workout summary

---

## Data Models (Firestore Collections)

### `/users/{userId}`
```typescript
{
  displayName: string;
  email: string;
  photoURL: string;
  weight: number;
  height: number;
  unitPreference: 'kg' | 'lbs';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `/exercises` (Global, read-only for users)
```typescript
{
  id: string;
  name: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Core';
  muscleGroups: string[];
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Other';
}
```

### `/users/{userId}/routines/{routineId}`
```typescript
{
  name: string;
  workoutType: 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'FullBody';
  intensity: 'Heavy' | 'Medium' | 'Light';
  estimatedDuration: number; // in minutes
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `/users/{userId}/workoutHistory/{workoutId}`
```typescript
{
  routineId: string;
  routineName: string;
  workoutType: 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'FullBody';
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number; // in seconds
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: {
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
  createdAt: Timestamp;
}
```

---

## Page Structure

```
/                     → Landing/Marketing page (redirect to /dashboard if logged in)
/login                → Google Sign-in page
/dashboard            → Home: Quick actions, recent routines, last workout summary
/routines             → List of saved routines
/routines/new         → AI routine generator form
/routines/[id]        → View/Edit routine details
/workout/[routineId]  → Active workout session
/history              → Workout history list
/history/[id]         → View past workout details
/settings             → User profile & preferences
```

---

## Component Architecture

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── routines/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── workout/
│   │   │   └── [routineId]/
│   │   │       └── page.tsx
│   │   ├── history/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   └── GoogleSignInButton.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── PageContainer.tsx
│   ├── routine/
│   │   ├── RoutineCard.tsx
│   │   ├── RoutineForm.tsx
│   │   └── ExerciseList.tsx
│   ├── workout/
│   │   ├── WorkoutTimer.tsx
│   │   ├── ExerciseCard.tsx
│   │   ├── SetRow.tsx
│   │   └── FinishWorkoutButton.tsx
│   ├── history/
│   │   ├── WorkoutHistoryCard.tsx
│   │   └── WorkoutDetail.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── Select.tsx
├── lib/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   └── firestore.ts
│   ├── ai/
│   │   ├── provider.ts
│   │   ├── openai.ts
│   │   ├── gemini.ts
│   │   └── prompts.ts
│   └── utils/
│       └── helpers.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useRoutines.ts
│   ├── useWorkout.ts
│   └── useHistory.ts
├── types/
│   └── index.ts
└── data/
    └── exercises.json
```

---

## AI Integration Layer

### Architecture

Using Vercel AI SDK for provider-agnostic implementation.

```
lib/ai/
├── provider.ts      → AIProvider interface and factory
├── openai.ts        → OpenAI implementation
├── gemini.ts        → Gemini implementation
└── prompts.ts       → Prompt templates
```

### Provider Interface

```typescript
interface AIProvider {
  generateRoutine(params: RoutineGenerationParams): Promise<GeneratedRoutine>;
}

interface RoutineGenerationParams {
  userWeight: number;
  userHeight: number;
  unitPreference: 'kg' | 'lbs';
  workoutType: WorkoutType;
  intensity: Intensity;
  duration: number;
  exerciseDatabase: Exercise[];
}

interface GeneratedRoutine {
  name: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
}
```

### Configuration

Switch providers via environment variable:
```env
AI_PROVIDER=openai  # or 'gemini'
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
```

---

## Future-Ready Design

The modular architecture supports future enhancements:

| Feature | How to Add |
|---------|------------|
| **Exercise Progress** | Query `workoutHistory` by `exerciseId` to calculate volume over time |
| **1RM Tracking** | Add `estimatedOneRepMax` field to workout exercise entries |
| **Calendar View** | Query history by date range, render in calendar component |
| **Routine Templates** | Add public routines collection, import/export functionality |
| **Rest Timer** | Add countdown timer component to workout session |
| **Social Features** | Add friends collection, share routines/workouts |

---

## MVP Screens

### 1. Landing Page (`/`)
- Hero section with app description
- "Get Started" CTA → redirects to login
- If already logged in → redirect to dashboard

### 2. Login Page (`/login`)
- Google Sign-in button (centered)
- App logo and tagline

### 3. Dashboard (`/dashboard`)
- Welcome message with user name
- "Create New Routine" button
- "Quick Start" section with recent routines
- Last workout summary card

### 4. Routines List (`/routines`)
- Grid/list of saved routines
- Each card shows: name, workout type, exercise count
- Click to view details
- "Create New" floating action button

### 5. Create Routine (`/routines/new`)
- Form with dropdowns:
  - Workout Type (Push/Pull/Legs/Upper/Lower/FullBody)
  - Intensity (Heavy/Medium/Light)
  - Duration (30min/1hr/2hr/custom input)
- "Generate with AI" button
- Preview generated routine
- Edit routine name
- "Save Routine" button

### 6. Routine Detail (`/routines/[id]`)
- Routine name (editable)
- Workout type and intensity badges
- Exercise list with sets/reps/weight
- Edit exercises inline
- "Start Workout" button
- "Delete Routine" button

### 7. Active Workout (`/workout/[routineId]`)
- Header: Routine name + Timer (00:00 counting up)
- Scrollable exercise cards:
  - Collapsed: Exercise name, "3x10" summary
  - Expanded: All sets with reps/weight inputs, checkboxes
- Floating "Finish Workout" button
- Confirmation modal before finishing

### 8. History List (`/history`)
- List of past workouts grouped by date
- Filter dropdown by workout type
- Each card shows: date, routine name, duration, exercise count

### 9. History Detail (`/history/[id]`)
- Workout date and duration
- Routine name and type
- Full exercise list with completed sets
- Stats summary (total volume, etc.)

### 10. Settings (`/settings`)
- Profile section (name, email - read only)
- Weight input
- Height input
- Unit preference toggle (kg/lbs)
- Sign out button

---

## Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
```

---

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Exercises collection - read only for all authenticated users
    match /exercises/{exerciseId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only via Firebase console
    }
    
    // User document - only owner can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User's routines - only owner can read/write
      match /routines/{routineId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // User's workout history - only owner can read/write
      match /workoutHistory/{workoutId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## Development Phases

### Phase 1: Foundation
- [x] Project setup (Next.js, TypeScript, TailwindCSS)
- [ ] Firebase configuration
- [ ] Authentication flow
- [ ] Basic layout components

### Phase 2: Core Features
- [ ] User profile & settings
- [ ] Exercise database seeding
- [ ] AI routine generation
- [ ] Routine CRUD operations

### Phase 3: Workout Flow
- [ ] Workout session UI
- [ ] Timer implementation
- [ ] Exercise tracking during workout
- [ ] Save workout to history

### Phase 4: History & Polish
- [ ] Workout history views
- [ ] Filters and sorting
- [ ] UI polish and responsiveness
- [ ] Error handling and loading states
