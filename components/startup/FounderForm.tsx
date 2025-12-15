"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { Founder } from "@/lib/types/startup";

interface FounderFormProps {
  founder: Founder;
  index: number;
  onChange: (founder: Founder) => void;
  onRemove: () => void;
  errors?: string[];
}

export function FounderForm({
  founder,
  index,
  onChange,
  onRemove,
  errors = [],
}: FounderFormProps) {
  const handleChange = (field: keyof Founder, value: string | number) => {
    onChange({
      ...founder,
      [field]: value,
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
          Founder {index + 1}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <X className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`founder-name-${index}`} className="text-black dark:text-white font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`founder-name-${index}`}
            value={founder.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`founder-email-${index}`} className="text-black dark:text-white font-medium">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`founder-email-${index}`}
            type="email"
            value={founder.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`founder-linkedin-${index}`} className="text-black dark:text-white font-medium">
            LinkedIn Profile
          </Label>
          <Input
            id={`founder-linkedin-${index}`}
            value={founder.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`founder-experience-${index}`} className="text-black dark:text-white font-medium">
            Years of Experience
          </Label>
          <Input
            id={`founder-experience-${index}`}
            type="number"
            min="0"
            value={founder.years_of_experience || ""}
            onChange={(e) =>
              handleChange("years_of_experience", parseInt(e.target.value) || 0)
            }
            placeholder="5"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={`founder-expertise-${index}`} className="text-black dark:text-white font-medium">
            Field of Expertise <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`founder-expertise-${index}`}
            value={founder.field_of_expertise || ""}
            onChange={(e) => handleChange("field_of_expertise", e.target.value)}
            placeholder="Software Engineering, Product Management, etc."
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-2">
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

