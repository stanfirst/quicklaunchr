/**
 * Types for Startup Onboarding Form
 */

export type BusinessStage = 'idea' | 'mvp' | 'early_stage' | 'growth' | 'scaling' | 'mature';
export type BusinessType = 'b2b' | 'b2c' | 'b2b2c' | 'marketplace' | 'saas' | 'ecommerce' | 'fintech' | 'healthtech' | 'edtech' | 'other';

export interface Founder {
  name: string;
  email: string;
  linkedin: string;
  years_of_experience: number;
  field_of_expertise: string;
}

export interface StartupFormData {
  // Step 1: Basic Information
  name: string;
  date_of_incorporation: string;
  registration_id: string;
  gst_no: string;
  business_pan_number: string;
  industry: string;
  business_type: BusinessType | '';
  description: string;
  
  // Step 2: Business Details
  revenue: string;
  stage: BusinessStage | '';
  product_is_live: boolean;
  investment_raised: string;
  current_valuation: string;
  ask_value: string;
  
  // Step 3: Founders
  founders: Founder[];
}

export interface StartupFormErrors {
  name?: string;
  date_of_incorporation?: string;
  registration_id?: string;
  gst_no?: string;
  business_pan_number?: string;
  industry?: string;
  business_type?: string;
  description?: string;
  revenue?: string;
  stage?: string;
  investment_raised?: string;
  current_valuation?: string;
  ask_value?: string;
  founders?: string;
  [key: string]: string | undefined;
}

