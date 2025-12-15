import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStartupProfile } from "@/app/actions/startup";
import { StartupProfile } from "@/components/startup/StartupProfile";

async function ProfileCheck() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is a startup type (from user metadata)
  const userType = user.user_metadata?.user_type;
  
  if (userType !== 'startup') {
    redirect("/");
  }

  const startup = await getStartupProfile();

  if (!startup) {
    redirect("/startup/onboarding");
  }

  return <StartupProfile startup={startup} />;
}

export default function StartupProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 dark:border-orange-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      }>
        <ProfileCheck />
      </Suspense>
    </div>
  );
}

