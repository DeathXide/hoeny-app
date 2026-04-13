/**
 * Validates that a string is a well-formed email address.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates that a value is not empty (trims whitespace).
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates that a string meets a minimum length requirement.
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validates an Indian phone number (10 digits, optionally with +91 prefix).
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validates an Indian GST number format (15 characters).
 */
export const validateGst = (gst: string): boolean => {
  const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z\d][A-Z]\d$/;
  return gstRegex.test(gst.trim().toUpperCase());
};

/**
 * Validates an Indian pincode (6 digits, first digit 1-9).
 */
export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9]\d{5}$/;
  return pincodeRegex.test(pincode.trim());
};
