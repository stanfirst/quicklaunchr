import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StartupOnboardingForm } from "@/components/startup/StartupOnboardingForm";

async function OnboardingContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user already has a startup profile
  const { data: startup } = await supabase
    .from('startup')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (startup) {
    redirect("/startup/profile");
  }

  // Check if user is a startup type (from user metadata)
  const userType = user.user_metadata?.user_type;
  
  if (userType !== 'startup') {
    redirect("/");
  }

  return (
    <div className="pt-20">
      <StartupOnboardingForm />
    </div>
  );
}

export default function StartupOnboardingPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

