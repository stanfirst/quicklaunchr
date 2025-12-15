"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stepper } from "./Stepper";
import { FounderForm } from "./FounderForm";
import { Plus } from "lucide-react";
import type { StartupFormData, StartupFormErrors, Founder, BusinessStage, BusinessType } from "@/lib/types/startup";
import {
  validateStep1,
  validateStep2,
  validateStep3,
} from "@/lib/utils/validation";
import { createStartupProfile } from "@/app/actions/startup";

const STEP_LABELS = ["Basic Information", "Business Details", "Founders"];

const BUSINESS_STAGES: { value: BusinessStage; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "early_stage", label: "Early Stage" },
  { value: "growth", label: "Growth" },
  { value: "scaling", label: "Scaling" },
  { value: "mature", label: "Mature" },
];

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "b2b", label: "B2B" },
  { value: "b2c", label: "B2C" },
  { value: "b2b2c", label: "B2B2C" },
  { value: "marketplace", label: "Marketplace" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Healthtech" },
  { value: "edtech", label: "Edtech" },
  { value: "other", label: "Other" },
];

const initialFormData: StartupFormData = {
  name: "",
  date_of_incorporation: "",
  registration_id: "",
  gst_no: "",
  business_pan_number: "",
  industry: "",
  business_type: "",
  description: "",
  revenue: "",
  stage: "",
  product_is_live: false,
  investment_raised: "",
  current_valuation: "",
  ask_value: "",
  founders: [
    {
      name: "",
      email: "",
      linkedin: "",
      years_of_experience: 0,
      field_of_expertise: "",
    },
  ],
};

const STORAGE_KEY = "startup-onboarding-form-data";
const STORAGE_STEP_KEY = "startup-onboarding-current-step";

// Helper function to load from localStorage
const loadFormDataFromStorage = (): StartupFormData | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading form data from localStorage:", error);
  }
  return null;
};

// Helper function to save to localStorage
const saveFormDataToStorage = (data: StartupFormData) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
};

// Helper function to load current step from localStorage
const loadCurrentStepFromStorage = (): number => {
  if (typeof window === "undefined") return 1;
  try {
    const stored = localStorage.getItem(STORAGE_STEP_KEY);
    if (stored) {
      const step = parseInt(stored, 10);
      return step >= 1 && step <= 3 ? step : 1;
    }
  } catch (error) {
    console.error("Error loading current step from localStorage:", error);
  }
  return 1;
};

// Helper function to save current step to localStorage
const saveCurrentStepToStorage = (step: number) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_STEP_KEY, step.toString());
  } catch (error) {
    console.error("Error saving current step to localStorage:", error);
  }
};

// Helper function to clear localStorage
const clearFormStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
  } catch (error) {
    console.error("Error clearing form data from localStorage:", error);
  }
};

export function StartupOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StartupFormData>(initialFormData);
  const [errors, setErrors] = useState<StartupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Load form data and step from localStorage on mount
  useEffect(() => {
    const savedFormData = loadFormDataFromStorage();
    const savedStep = loadCurrentStepFromStorage();
    
    if (savedFormData) {
      setFormData(savedFormData);
    }
    if (savedStep) {
      setCurrentStep(savedStep);
    }
    setIsInitialized(true);
  }, []);

  // Save form data to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveFormDataToStorage(formData);
    }
  }, [formData, isInitialized]);

  // Save current step to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCurrentStepToStorage(currentStep);
    }
  }, [currentStep, isInitialized]);

  const updateFormData = (field: keyof StartupFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    let stepErrors: StartupFormErrors = {};

    if (currentStep === 1) {
      stepErrors = validateStep1(formData);
    } else if (currentStep === 2) {
      stepErrors = validateStep2(formData);
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleAddFounder = () => {
    updateFormData("founders", [
      ...formData.founders,
      {
        name: "",
        email: "",
        linkedin: "",
        years_of_experience: 0,
        field_of_expertise: "",
      },
    ]);
  };

  const handleFounderChange = (index: number, founder: Founder) => {
    const newFounders = [...formData.founders];
    newFounders[index] = founder;
    updateFormData("founders", newFounders);
  };

  const handleRemoveFounder = (index: number) => {
    if (formData.founders.length > 1) {
      const newFounders = formData.founders.filter((_, i) => i !== index);
      updateFormData("founders", newFounders);
    }
  };

  const handleSubmit = async () => {
    const step3Errors = validateStep3(formData);
    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createStartupProfile(formData);
      // Clear localStorage on successful submission
      clearFormStorage();
      router.push("/startup/profile");
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to save startup profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-black dark:text-white font-medium">
            Startup Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            placeholder="Your Startup Name"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_incorporation" className="text-black dark:text-white font-medium">
            Date of Incorporation
          </Label>
          <Input
            id="date_of_incorporation"
            type="date"
            value={formData.date_of_incorporation}
            onChange={(e) => updateFormData("date_of_incorporation", e.target.value)}
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.date_of_incorporation && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.date_of_incorporation}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration_id" className="text-black dark:text-white font-medium">
            Registration ID
          </Label>
          <Input
            id="registration_id"
            value={formData.registration_id}
            onChange={(e) => updateFormData("registration_id", e.target.value)}
            placeholder="Company Registration Number"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.registration_id && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.registration_id}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst_no" className="text-black dark:text-white font-medium">
            GST No.
          </Label>
          <Input
            id="gst_no"
            value={formData.gst_no}
            onChange={(e) => updateFormData("gst_no", e.target.value.toUpperCase())}
            placeholder="15-digit GST Number"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.gst_no && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.gst_no}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_pan_number" className="text-black dark:text-white font-medium">
            Business PAN Number
          </Label>
          <Input
            id="business_pan_number"
            value={formData.business_pan_number}
            onChange={(e) => updateFormData("business_pan_number", e.target.value.toUpperCase())}
            placeholder="ABCDE1234F"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.business_pan_number && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.business_pan_number}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-black dark:text-white font-medium">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => updateFormData("industry", e.target.value)}
            placeholder="e.g., Technology, Healthcare, Finance"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.industry && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.industry}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="business_type" className="text-black dark:text-white font-medium">
            Business Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.business_type}
            onValueChange={(value) => updateFormData("business_type", value)}
          >
            <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.business_type && (
            <p className="text-sm text-red-600 mt-1">{errors.business_type}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-black dark:text-white font-medium">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            placeholder="Describe your startup, its mission, and what makes it unique (minimum 50 characters)"
            rows={5}
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.description && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formData.description.length} characters
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="revenue" className="text-black dark:text-white font-medium">
            Revenue (₹)
          </Label>
          <Input
            id="revenue"
            type="number"
            min="0"
            step="0.01"
            value={formData.revenue}
            onChange={(e) => updateFormData("revenue", e.target.value)}
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.revenue && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.revenue}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage" className="text-black dark:text-white font-medium">
            Business Stage <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.stage}
            onValueChange={(value) => updateFormData("stage", value)}
          >
            <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_STAGES.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stage && (
            <p className="text-sm text-red-600 mt-1">{errors.stage}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment_raised" className="text-black dark:text-white font-medium">
            Investment Raised (₹)
          </Label>
          <Input
            id="investment_raised"
            type="number"
            min="0"
            step="0.01"
            value={formData.investment_raised}
            onChange={(e) => updateFormData("investment_raised", e.target.value)}
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.investment_raised && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.investment_raised}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_valuation" className="text-black dark:text-white font-medium">
            Current Valuation (₹)
          </Label>
          <Input
            id="current_valuation"
            type="number"
            min="0"
            step="0.01"
            value={formData.current_valuation}
            onChange={(e) => updateFormData("current_valuation", e.target.value)}
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.current_valuation && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.current_valuation}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ask_value" className="text-black dark:text-white font-medium">
            Ask Value (₹)
          </Label>
          <Input
            id="ask_value"
            type="number"
            min="0"
            step="0.01"
            value={formData.ask_value}
            onChange={(e) => updateFormData("ask_value", e.target.value)}
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-600 dark:focus:border-orange-500 focus:ring-orange-600 dark:focus:ring-orange-500"
          />
          {errors.ask_value && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.ask_value}</p>
          )}
        </div>

        <div className="space-y-2 flex items-center">
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="product_is_live"
              checked={formData.product_is_live}
              onCheckedChange={(checked) =>
                updateFormData("product_is_live", checked === true)
              }
              className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-orange-600 dark:data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-600 dark:data-[state=checked]:border-orange-500"
            />
            <Label
              htmlFor="product_is_live"
              className="text-black dark:text-white font-medium cursor-pointer"
            >
              Product is Live
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Founders Information</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add details about all founders of your startup
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddFounder}
          className="border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Founder
        </Button>
      </div>

      <div className="space-y-4">
        {formData.founders.map((founder, index) => (
          <FounderForm
            key={`founder-${index}-${founder.email || founder.name || index}`}
            founder={founder}
            index={index}
            onChange={(updatedFounder) => handleFounderChange(index, updatedFounder)}
            onRemove={() => handleRemoveFounder(index)}
            errors={
              errors.founders
                ? errors.founders
                    .split("; ")
                    .filter((e) => e.startsWith(`Founder ${index + 1}`))
                    .map((e) => e.replace(`Founder ${index + 1}: `, ""))
                : []
            }
          />
        ))}
      </div>

      {errors.founders && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{errors.founders}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-black dark:text-white text-center">
              Startup Onboarding
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
              Complete your startup profile to connect with investors
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Stepper
              currentStep={currentStep}
              totalSteps={3}
              stepLabels={STEP_LABELS}
            />

            <div className="mt-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

