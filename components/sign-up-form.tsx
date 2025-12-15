"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserType } from "@/lib/supabase/types";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [userType, setUserType] = useState<UserType | "">("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!userType) {
      setError("Please select whether you are a startup or investor");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up the user with user_type in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: {
            user_type: userType,
            role: 'user',
          },
        },
      });

      if (authError) throw authError;

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-gray-200 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-black">Create Account</CardTitle>
          <CardDescription className="text-gray-600">
            Join QuickLaunchr and start your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password" className="text-black font-medium">Confirm Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="user-type" className="text-black font-medium">I am a</Label>
                <div className="flex gap-6">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      id="startup"
                      name="userType"
                      value="startup"
                      checked={userType === "startup"}
                      onChange={(e) => setUserType(e.target.value as UserType)}
                      className="h-5 w-5 text-orange-600 border-gray-300 focus:ring-orange-600 focus:ring-2"
                      required
                    />
                    <span className={`font-medium transition-colors ${
                      userType === "startup" ? "text-orange-600" : "text-gray-700"
                    } group-hover:text-orange-600`}>
                      Startup
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      id="investor"
                      name="userType"
                      value="investor"
                      checked={userType === "investor"}
                      onChange={(e) => setUserType(e.target.value as UserType)}
                      className="h-5 w-5 text-orange-600 border-gray-300 focus:ring-orange-600 focus:ring-2"
                      required
                    />
                    <span className={`font-medium transition-colors ${
                      userType === "investor" ? "text-orange-600" : "text-gray-700"
                    } group-hover:text-orange-600`}>
                      Investor
                    </span>
                  </label>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-medium underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
