"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function Stepper({ currentStep, totalSteps, stepLabels }: StepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
                    isCompleted &&
                      "bg-orange-600 border-orange-600 text-white",
                    isCurrent &&
                      "bg-orange-600 dark:bg-orange-500 border-orange-600 dark:border-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900/50",
                    isPending &&
                      "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-orange-600 dark:text-orange-400",
                      isCompleted && "text-gray-600 dark:text-gray-400",
                      isPending && "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {label}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    isCompleted ? "bg-orange-600 dark:bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

