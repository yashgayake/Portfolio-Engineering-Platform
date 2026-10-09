/**
 * Comprehensive Email Validator & Typo Detector
 * Strictly prevents invalid email syntax and detects common domain/TLD typos
 * such as "@gmail.con", "@gmai.com", "@yahoo.con", etc.
 */

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
  cleanEmail: string;
}

// Common TLD typos mapped to their correct equivalents
const TYPO_TLDS: Record<string, string> = {
  'con': 'com',
  'cmo': 'com',
  'cm': 'com',
  'comm': 'com',
  'coom': 'com',
  'ocm': 'com',
  'cpm': 'com',
  'xom': 'com',
  'vom': 'com',
  'col': 'com',
  'ney': 'net',
  'nett': 'net',
  'ner': 'net',
  'orgg': 'org',
  'ogr': 'org',
  'eddu': 'edu'
};

// Common domain typos mapped to their authentic domain
const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gemail.com': 'gmail.com',
  'g-mail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmail.org': 'gmail.com',
  'gmail.net': 'gmail.com',
  'gmail.in': 'gmail.com', // Official consumer Gmail addresses only end with @gmail.com
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yaho.co.in': 'yahoo.co.in',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com'
};

// Established top-level domains list
const KNOWN_VALID_TLDS = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'in', 'io', 'co', 'ai', 'me', 'dev', 'app', 'tech',
  'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'br', 'ru',
  'nl', 'se', 'no', 'fi', 'es', 'it', 'ch', 'at', 'za',
  'info', 'biz', 'cloud', 'design', 'store', 'online', 'site',
  'xyz', 'link', 'live', 'agency', 'space', 'academy', 'global',
  'pro', 'asia', 'mobi', 'name', 'tv', 'cc', 'us', 'eu', 'id', 'sg', 'ae', 'sa'
]);

export function validateEmail(rawEmail: string): EmailValidationResult {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return {
      isValid: false,
      error: 'Please enter your email address.',
      cleanEmail: ''
    };
  }

  const cleanEmail = rawEmail.trim().toLowerCase();

  if (cleanEmail.length === 0) {
    return {
      isValid: false,
      error: 'Email address cannot be empty.',
      cleanEmail: ''
    };
  }

  if (cleanEmail.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long (maximum 254 characters).',
      cleanEmail
    };
  }

  // Must contain exactly one "@"
  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: 'Please enter a valid email address with an "@" symbol (e.g. name@gmail.com).',
      cleanEmail
    };
  }

  const [localPart, domainPart] = parts;

  // Local part (username) validation
  if (!localPart || localPart.length === 0) {
    return {
      isValid: false,
      error: 'Email username before "@" cannot be empty.',
      cleanEmail
    };
  }

  if (localPart.length > 64) {
    return {
      isValid: false,
      error: 'Email username before "@" cannot exceed 64 characters.',
      cleanEmail
    };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'Email username cannot start or end with a dot (".").',
      cleanEmail
    };
  }

  if (localPart.includes('..')) {
    return {
      isValid: false,
      error: 'Email username cannot contain consecutive dots ("..").',
      cleanEmail
    };
  }

  const localRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!localRegex.test(localPart)) {
    return {
      isValid: false,
      error: 'Email username contains invalid characters.',
      cleanEmail
    };
  }

  // Domain part validation
  if (!domainPart || domainPart.length === 0) {
    return {
      isValid: false,
      error: 'Please enter a complete domain after "@" (e.g. gmail.com).',
      cleanEmail
    };
  }

  if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'Domain name cannot start or end with a dot (".").',
      cleanEmail
    };
  }

  if (domainPart.includes('..')) {
    return {
      isValid: false,
      error: 'Domain name cannot contain consecutive dots ("..").',
      cleanEmail
    };
  }

  // Check against known whole-domain typos first (like "gmail.con" or "gmai.com")
  if (COMMON_DOMAIN_TYPOS[domainPart]) {
    const suggestedDomain = COMMON_DOMAIN_TYPOS[domainPart];
    const suggestedEmail = `${localPart}@${suggestedDomain}`;
    return {
      isValid: false,
      error: `Invalid email domain "@${domainPart}". Did you mean "@${suggestedDomain}"?`,
      suggestion: suggestedEmail,
      cleanEmail
    };
  }

  const domainLabels = domainPart.split('.');
  if (domainLabels.length < 2) {
    return {
      isValid: false,
      error: 'Incomplete email domain. Missing extension like ".com" (e.g. yourname@gmail.com).',
      cleanEmail
    };
  }

  // Check each domain label
  for (const label of domainLabels) {
    if (!label || label.length === 0) {
      return {
        isValid: false,
        error: 'Email domain contains an empty segment.',
        cleanEmail
      };
    }
    if (label.startsWith('-') || label.endsWith('-')) {
      return {
        isValid: false,
        error: 'Domain segments cannot start or end with a hyphen ("-").',
        cleanEmail
      };
    }
    if (!/^[a-zA-Z0-9-]+$/.test(label)) {
      return {
        isValid: false,
        error: 'Domain contains invalid characters. Only letters, numbers, and hyphens are allowed.',
        cleanEmail
      };
    }
  }

  const tld = domainLabels[domainLabels.length - 1];

  // TLD must be strictly alphabetic and 2-24 characters
  if (!/^[a-zA-Z]{2,24}$/.test(tld)) {
    return {
      isValid: false,
      error: `"${tld}" is not a valid domain extension. Valid examples: .com, .org, .edu, .in`,
      cleanEmail
    };
  }

  // Specific check for Gmail domain syntax
  if (domainLabels.length === 2 && domainLabels[0] === 'gmail') {
    if (tld !== 'com') {
      const suggestedEmail = `${localPart}@gmail.com`;
      return {
        isValid: false,
        error: `Gmail addresses must end with "@gmail.com" (you entered "@${domainPart}").`,
        suggestion: suggestedEmail,
        cleanEmail
      };
    }
  }

  // Check known typo TLDs
  if (TYPO_TLDS[tld]) {
    const correctedTld = TYPO_TLDS[tld];
    const correctedDomain = domainLabels.slice(0, -1).join('.') + '.' + correctedTld;
    const suggestedEmail = `${localPart}@${correctedDomain}`;
    return {
      isValid: false,
      error: `Invalid domain extension ".${tld}". Did you mean "${suggestedEmail}"?`,
      suggestion: suggestedEmail,
      cleanEmail
    };
  }

  // If TLD is 2-4 chars and not recognized in common list, check if it's likely a typo of .com
  if (tld.length <= 4 && !KNOWN_VALID_TLDS.has(tld)) {
    if (tld.includes('co') || tld.includes('om') || tld.includes('cm') || tld.includes('cn')) {
      const correctedDomain = domainLabels.slice(0, -1).join('.') + '.com';
      const suggestedEmail = `${localPart}@${correctedDomain}`;
      return {
        isValid: false,
        error: `Unrecognized extension ".${tld}". Did you mean ".com"?`,
        suggestion: suggestedEmail,
        cleanEmail
      };
    }
  }

  return {
    isValid: true,
    cleanEmail
  };
}
