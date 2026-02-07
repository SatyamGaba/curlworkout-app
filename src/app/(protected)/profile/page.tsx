"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { updateUserProfile } from "@/lib/firebase/auth";
import { cn, getAuthDisplayInfo } from "@/lib/utils/helpers";
import type { UnitPreference } from "@/types";

type Theme = "light" | "dark" | "system";

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function ProfilePage() {
  const { user, userProfile, refreshProfile, logout } = useAuthContext();
  const { displayName, photoURL, email, avatarInitial } = getAuthDisplayInfo(
    user,
    userProfile
  );
  const { theme, setTheme } = useTheme();
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unitPreference, setUnitPreference] = useState<UnitPreference>("kg");
  const [weeklyGoal, setWeeklyGoal] = useState<string>("4");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setWeight(userProfile.weight?.toString() || "");
      setHeight(userProfile.height?.toString() || "");
      setUnitPreference(userProfile.unitPreference || "kg");
      setWeeklyGoal(userProfile.weeklyGoal?.toString() || "4");
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await updateUserProfile(user.uid, {
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        unitPreference,
        weeklyGoal: weeklyGoal ? parseInt(weeklyGoal) : 4,
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer title="Profile" description="Manage your profile and preferences">
      <div className="max-w-2xl space-y-6">
        {/* Profile Info */}
        <Card className="neumorphic-card">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {photoURL ? (
                <Image
                  src={photoURL}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 text-xl font-medium">
                    {avatarInitial}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="neumorphic-card">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred theme
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all text-sm font-medium",
                    theme === option.value
                      ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Streak Info */}
        <Card className="neumorphic-card">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Progress
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.currentStreak || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Streak
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.longestStreak || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Longest Streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Stats */}
        <Card className="neumorphic-card">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Physical Stats
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Used for AI-generated workout recommendations
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="weight"
                label={`Weight (${unitPreference})`}
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your weight"
              />
              <Input
                id="height"
                label="Height (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter your height"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="neumorphic-card">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferences
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              id="unitPreference"
              label="Weight Unit"
              value={unitPreference}
              onChange={(e) => setUnitPreference(e.target.value as UnitPreference)}
              options={[
                { value: "kg", label: "Kilograms (kg)" },
                { value: "lbs", label: "Pounds (lbs)" },
              ]}
            />
            <Input
              id="weeklyGoal"
              label="Weekly Workout Goal"
              type="number"
              min="1"
              max="7"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(e.target.value)}
              placeholder="4"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button onClick={handleSave} isLoading={saving}>
            {saved ? "Saved!" : "Save Changes"}
          </Button>
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400">
              Your changes have been saved.
            </span>
          )}
        </div>

        {/* Danger Zone */}
        <Card className="border border-red-200 dark:border-red-900">
          <CardHeader>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Account
            </h2>
          </CardHeader>
          <CardContent>
            <Button variant="danger" onClick={logout}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
