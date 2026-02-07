import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import type { User } from "@/types";

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserProfileIfNotExists(result.user);
  return result.user;
}

export async function signInWithApple(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, appleProvider);
  await createUserProfileIfNotExists(result.user);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function createUserProfileIfNotExists(
  firebaseUser: FirebaseUser
): Promise<void> {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: Omit<User, "id"> = {
      displayName: firebaseUser.displayName || "User",
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL,
      weight: null,
      height: null,
      unitPreference: "kg",
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
      weeklyGoal: 4,
      createdAt: serverTimestamp() as User["createdAt"],
      updatedAt: serverTimestamp() as User["updatedAt"],
    };

    await setDoc(userRef, newUser);
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as User;
  }

  return null;
}

export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<User, "weight" | "height" | "unitPreference" | "weeklyGoal">>
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
