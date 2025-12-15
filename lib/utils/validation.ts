/**
 * Validation utilities for startup form
 */

import type { StartupFormData, StartupFormErrors, Founder } from '@/lib/types/startup';

/**
 * Validates GST number format (15 characters, alphanumeric)
 */
export function validateGST(gst: string): boolean {
  if (!gst) return true; // Optional field
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase());
}

/**
 * Validates PAN number format (10 characters, alphanumeric)
 */
export function validatePAN(pan: string): boolean {
  if (!pan) return true; // Optional field
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates LinkedIn URL format
 */
export function validateLinkedIn(linkedin: string): boolean {
  if (!linkedin) return true; // Optional field
  const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
  return linkedinRegex.test(linkedin);
}

/**
 * Validates a founder object
 */
export function validateFounder(founder: Founder): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!founder.name?.trim()) {
    errors.push('Founder name is required');
  }
  
  if (!founder.email?.trim()) {
    errors.push('Founder email is required');
  } else if (!validateEmail(founder.email)) {
    errors.push('Founder email is invalid');
  }
  
  if (founder.linkedin && !validateLinkedIn(founder.linkedin)) {
    errors.push('LinkedIn URL is invalid');
  }
  
  if (founder.years_of_experience !== undefined && founder.years_of_experience < 0) {
    errors.push('Years of experience cannot be negative');
  }
  
  if (!founder.field_of_expertise?.trim()) {
    errors.push('Field of expertise is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates step 1 (Basic Information)
 */
export function validateStep1(data: StartupFormData): StartupFormErrors {
  const errors: StartupFormErrors = {};
  
  if (!data.name?.trim()) {
    errors.name = 'Startup name is required';
  }
  
  if (data.date_of_incorporation) {
    const date = new Date(data.date_of_incorporation);
    const today = new Date();
    if (date > today) {
      errors.date_of_incorporation = 'Date of incorporation cannot be in the future';
    }
  }
  
  if (data.gst_no && !validateGST(data.gst_no)) {
    errors.gst_no = 'Invalid GST number format';
  }
  
  if (data.business_pan_number && !validatePAN(data.business_pan_number)) {
    errors.business_pan_number = 'Invalid PAN number format';
  }
  
  if (!data.industry?.trim()) {
    errors.industry = 'Industry is required';
  }
  
  if (!data.business_type) {
    errors.business_type = 'Business type is required';
  }
  
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 50) {
    errors.description = 'Description must be at least 50 characters';
  }
  
  return errors;
}

/**
 * Validates step 2 (Business Details)
 */
export function validateStep2(data: StartupFormData): StartupFormErrors {
  const errors: StartupFormErrors = {};
  
  if (data.revenue) {
    const revenue = parseFloat(data.revenue);
    if (isNaN(revenue) || revenue < 0) {
      errors.revenue = 'Revenue must be a valid positive number';
    }
  }
  
  if (!data.stage) {
    errors.stage = 'Business stage is required';
  }
  
  if (data.investment_raised) {
    const investment = parseFloat(data.investment_raised);
    if (isNaN(investment) || investment < 0) {
      errors.investment_raised = 'Investment raised must be a valid positive number';
    }
  }
  
  if (data.current_valuation) {
    const valuation = parseFloat(data.current_valuation);
    if (isNaN(valuation) || valuation < 0) {
      errors.current_valuation = 'Current valuation must be a valid positive number';
    }
  }
  
  if (data.ask_value) {
    const askValue = parseFloat(data.ask_value);
    if (isNaN(askValue) || askValue < 0) {
      errors.ask_value = 'Ask value must be a valid positive number';
    }
  }
  
  return errors;
}

/**
 * Validates step 3 (Founders)
 */
export function validateStep3(data: StartupFormData): StartupFormErrors {
  const errors: StartupFormErrors = {};
  
  if (!data.founders || data.founders.length === 0) {
    errors.founders = 'At least one founder is required';
    return errors;
  }
  
  // Validate each founder
  const founderErrors: string[] = [];
  data.founders.forEach((founder, index) => {
    const validation = validateFounder(founder);
    if (!validation.isValid) {
      founderErrors.push(`Founder ${index + 1}: ${validation.errors.join(', ')}`);
    }
  });
  
  if (founderErrors.length > 0) {
    errors.founders = founderErrors.join('; ');
  }
  
  return errors;
}

/**
 * Validates the entire form
 */
export function validateForm(data: StartupFormData): StartupFormErrors {
  return {
    ...validateStep1(data),
    ...validateStep2(data),
    ...validateStep3(data),
  };
}

