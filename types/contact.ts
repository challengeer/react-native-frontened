/**
 * Represents a unique identifier for a contact
 */
export type ContactId = string;

/**
 * Represents a phone number in E.164 format
 */
export type PhoneNumber = string;

/**
 * Base contact interface with basic information
 */
export interface Contact {
    contact_id: ContactId;
    contact_name: string;
    phone_number: PhoneNumber;
}

/**
 * Represents a contact that can be recommended as a friend
 * This is used when a contact is not yet a user in the system
 */
export interface ContactRecommendation extends Contact {
    is_registered: boolean;
    user_id?: string; // Only present if is_registered is true
} 