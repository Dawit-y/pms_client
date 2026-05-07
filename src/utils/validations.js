import * as Yup from 'yup';

import i18n from '../i18n';
const t = i18n.t.bind(i18n);

/**
 * Reusable alphanumeric validation schema.
 * @param {number} minLength - Minimum length of the string.
 * @param {number} maxLength - Maximum length of the string.
 * @param {boolean} isRequired - Whether the field is required.
 * @returns {Yup.StringSchema} - The Yup validation schema.
 */
export const alphanumericValidation = (
  minLength,
  maxLength,
  isRequired = true
) => {
  let schema = Yup.string()
    .matches(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9 !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/,
      t('val_alphanumeric')
    )
    .min(minLength, `${t('val_min_length')}: ${minLength}`)
    .max(maxLength, `${t('val_max_length')}: ${maxLength}`);

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }
  return schema;
};

export const onlyAmharicValidation = (
  minLength,
  maxLength,
  isRequired = true
) => {
  let schema = Yup.string()
    .matches(
      /^[\u1200-\u137F0-9\s.,;!?@#$%^&*()_+\-=[\]{}|:'"<>\\/`~]+$/,
      t('only_amharic')
    )
    .min(minLength, `${t('val_min_length')}: ${minLength}`)
    .max(maxLength, `${t('val_max_length')}: ${maxLength}`);

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }
  return schema;
};

export const phoneValidation = (isRequired = true) => {
  let schema = Yup.string().matches(/^[79]\d{8}$/, t('val_phone_number'));
  if (isRequired) {
    schema = schema.required(t('val_required'));
  }
  return schema;
};

export const amountValidation = (minLength, maxLength, isRequired = true) => {
  let schema = Yup.number()
    .typeError(t('val_required')) // Ensures non-numeric values show the required error
    .min(minLength, `${t('val_min_amount')}: ${minLength}`)
    .max(maxLength, `${t('val_max_amount')}: ${maxLength}`)
    .test(
      'is-decimal',
      t('val_two_decimal_places'),
      (value) =>
        value === 0 ||
        value === undefined ||
        value === null ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    );

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }

  return schema;
};

export const formattedNumberValidation = (
  min,
  max,
  isRequired = true,
  allowDecimal = false,
  decimalPlaces = 6
) => {
  const cleanValue = (value) => {
    if (typeof value === 'number') return value.toString();
    if (typeof value !== 'string') return '';

    let val = value.replace(/,/g, '');

    // remove trailing decimal (ex: "123.")
    if (val.endsWith('.')) {
      val = val.slice(0, -1);
    }

    return val;
  };

  const numberRegex = allowDecimal
    ? new RegExp(`^\\d+(\\.\\d{1,${decimalPlaces}})?$`)
    : /^\d+$/;

  let schema = Yup.mixed()
    .nullable()
    .transform((value, originalValue) => {
      // Transform empty strings and null to null
      if (
        originalValue === '' ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return null;
      }
      return value;
    })
    .test('is-numeric', t('val_invalid_number'), (value) => {
      if (value === undefined || value === null || value === '') return true;

      const val = cleanValue(value);
      return numberRegex.test(val);
    })
    .test(
      'min-value',
      `${t('val_min_amount')}: ${parseFloat(min).toLocaleString()}`,
      (value) => {
        if (value === undefined || value === null || value === '') return true;

        const val = cleanValue(value);
        const num = parseFloat(val);

        if (isNaN(num)) return false;

        return num >= min;
      }
    )
    .test(
      'max-value',
      `${t('val_max_amount')}: ${parseFloat(max).toLocaleString()}`,
      (value) => {
        if (value === undefined || value === null || value === '') return true;

        const val = cleanValue(value);
        const num = parseFloat(val);

        if (isNaN(num)) return false;

        return num <= max;
      }
    );

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }

  return schema;
};

export const numberValidation = (minLength, maxLength, isRequired = true) => {
  let schema = Yup.number()
    .integer(`${t('val_integer_only')}: ${maxLength}`)
    .min(minLength, `${t('val_min_number')}: ${minLength}`)
    .max(maxLength, `${t('val_max_number')}: ${maxLength}`);
  if (isRequired) {
    schema = schema.required(t('val_required'));
  }
  return schema;
};

export const dropdownValidation = (minLength, maxLength, isRequired = true) => {
  let schema = Yup.number()
    .integer(`${t('val_integer_only')}: ${maxLength}`)
    .min(minLength, `${t('val_min_number')}: ${minLength}`)
    .max(maxLength, `${t('val_max_number')}: ${maxLength}`);
  if (isRequired) {
    schema = schema.required(t('val_required'));
  }
  return schema;
};

export const websiteUrlValidation = (required = false) => {
  let schema = Yup.string().matches(
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    'Invalid website URL'
  );

  if (required) {
    schema = schema.required('Website URL is required');
  }

  return schema;
};

export const emailValidation = (isRequired = true) => {
  let schema = Yup.string()
    .email(t('val_invalid_email')) // Built-in Yup email validation
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Additional format check
      t('val_invalid_email_format')
    );

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }

  return schema;
};
export const tinValidation = (minLength, maxLength, isRequired = true) => {
  let schema = Yup.string()
    // Only letters and numbers allowed (no spaces or special chars)
    .matches(
      /^[a-zA-Z0-9]*$/, // <-- Only alphanumeric characters
      t('val_letters_numbers_only') // Error message key
    )
    .min(minLength, t('val_min_length', { length: minLength }))
    .max(maxLength, t('val_max_length', { length: maxLength }));

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }

  return schema;
};

export const checkPasswordStrength = (password) => {
  if (password.length < 8) return 'Too short';
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)
    return 'Strong';
  if (hasUpperCase && hasLowerCase && (hasNumber || hasSpecialChar))
    return 'Moderate';
  return 'Weak';
};

export const websiteValidation = (required = false, t) => {
  let validator = Yup.string()
    .matches(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      t ? t('invalid_website') : 'Invalid website URL'
    )
    .max(100, t ? t('max_length', { max: 100 }) : 'Maximum 100 characters');

  if (required) {
    validator = validator.required(t ? t('field_required') : 'Required');
  }

  return validator;
};

export const yearValidation = (
  isRequired = true,
  minYear = 1900,
  maxYear = 2100
) => {
  let schema = Yup.number()
    .integer(t('val_integer_only'))
    .typeError(t('val_required'))
    .test('is-four-digits', t('val_four_digits_only'), (value) => {
      if (value === undefined || value === null) return true;
      return /^\d{4}$/.test(value.toString());
    })
    .min(minYear, `${t('val_min_year')}: ${minYear}`)
    .max(maxYear, `${t('val_max_year')}: ${maxYear}`);

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }

  return schema;
};

export const hexColorValidation = (isRequired = true) => {
  let schema = Yup.string().matches(
    /^#([0-9A-F]{3}){1,2}$/i,
    t('val_hex_color_code') || 'Invalid Hex color code'
  );

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }

  return schema;
};

export const landSizeValidation = (isRequired = true) => {
  const decimalPlaces = 6;
  const minValue = 0;
  const maxValue = 999999999.999999;

  let schema = Yup.number()
    .typeError(t('val_required'))
    .min(minValue, t('val_min_land_size'))
    .max(maxValue, t('val_max_land_size'))
    .test('decimal-places', t('val_max_six_decimals'), (value) => {
      if (value === undefined || value === null || value === 0) return true;

      // Check if value has more than 6 decimal places
      const valueStr = value.toString();
      if (valueStr.includes('.')) {
        const decimalPart = valueStr.split('.')[1];
        return decimalPart.length <= decimalPlaces;
      }
      return true;
    });

  if (isRequired) {
    schema = schema.required(t('val_required'));
  }

  return schema;
};
