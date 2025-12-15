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
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-black dark:text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Password reset instructions sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-700 dark:text-green-400">
                If you registered using your email and password, you will receive
                a password reset email.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-black dark:text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your email address and we will send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-black dark:text-white font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
