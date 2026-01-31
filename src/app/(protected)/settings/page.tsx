"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { updateUserProfile } from "@/lib/firebase/auth";
import type { UnitPreference } from "@/types";

export default function SettingsPage() {
  const { user, userProfile, refreshProfile, logout } = useAuthContext();
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unitPreference, setUnitPreference] = useState<UnitPreference>("kg");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setWeight(userProfile.weight?.toString() || "");
      setHeight(userProfile.height?.toString() || "");
      setUnitPreference(userProfile.unitPreference || "kg");
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
    <PageContainer title="Settings" description="Manage your profile and preferences">
      <div className="max-w-2xl space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {userProfile?.photoURL ? (
                <Image
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 text-xl font-medium">
                    {userProfile?.displayName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {userProfile?.displayName || "User"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userProfile?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Stats */}
        <Card>
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
        <Card>
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
        <Card className="border border-red-200 dark:border-red-800">
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
