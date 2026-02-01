"use client";

import { useState, useEffect, useCallback } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  onAuthChange,
  signInWithGoogle,
  signOut,
  getUserProfile,
} from "@/lib/firebase/auth";
import type { User } from "@/types";

interface AuthState {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setState({
            user: firebaseUser,
            userProfile: profile,
            loading: false,
            error: null,
          });
        } catch (error) {
          setState({
            user: firebaseUser,
            userProfile: null,
            loading: false,
            error: "Failed to load user profile",
          });
        }
      } else {
        setState({
          user: null,
          userProfile: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithGoogle();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Sign in failed",
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await signOut();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Sign out failed",
      }));
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (state.user) {
      const profile = await getUserProfile(state.user.uid);
      setState((prev) => ({ ...prev, userProfile: profile }));
    }
  }, [state.user]);

  return {
    user: state.user,
    userProfile: state.userProfile,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    refreshProfile,
  };
}
