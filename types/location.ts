/**
 * Represents a country code in ISO 3166-1 alpha-2 format
 */
export type CountryCode = string;

/**
 * Represents a country with its basic information
 */
export interface Country {
    flag: string; // Emoji flag
    name: string;
    code: CountryCode;
    dial_code: string; // International dialing code with + prefix
} 