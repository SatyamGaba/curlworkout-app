# CurlWorkout App

An AI-powered gym workout tracking application built with Next.js, Firebase, and TailwindCSS.

## Features

- **AI Routine Generation**: Generate personalized workout routines using OpenAI or Google Gemini
- **Google Authentication**: Secure sign-in with Firebase Auth
- **Workout Tracking**: Real-time workout session with timer and progress tracking
- **Exercise Database**: 65+ predefined exercises across Push, Pull, Legs, and Core categories
- **Workout History**: View and filter your past workouts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Authentication**: Firebase Authentication (Google Sign-in)
- **Database**: Cloud Firestore
- **AI**: Vercel AI SDK with OpenAI/Google Gemini support

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore and Authentication enabled
- OpenAI API key or Google AI API key

### Installation

1. Clone the repository and navigate to the app folder:
   ```bash
   cd curlworkout-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # AI Provider (choose one)
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-openai-key
   # OR
   AI_PROVIDER=google
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key
   ```

4. Set up Firebase:
   - Enable Google Authentication in Firebase Console
   - Create a Firestore database
   - (Optional) Seed the exercises collection from `data/exercises.json`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login)
│   ├── (protected)/       # Protected pages requiring auth
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── history/           # Workout history components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   ├── routine/           # Routine components
│   ├── ui/                # Reusable UI components
│   └── workout/           # Workout session components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── ai/                # AI integration
│   ├── firebase/          # Firebase configuration
│   └── utils/             # Helper functions
├── types/                 # TypeScript type definitions
└── data/                  # Static data files
```

## Firebase Security Rules

Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /exercises/{exerciseId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /routines/{routineId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /workoutHistory/{workoutId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## License

MIT
