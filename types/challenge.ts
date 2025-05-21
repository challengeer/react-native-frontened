import { User } from "@/types/user";

export type ChallengeCompletionStatus = 'completed' | 'failed' | 'not_started';

/**
 * Represents a unique identifier for a challenge
 */
export type ChallengeId = string;

/**
 * Represents a challenge with all its details
 */
export interface Challenge {
    challenge_id: ChallengeId;
    title: string;
    description: string;
    emoji: string;
    category: string;
    created_at: string; // ISO 8601 date string
    end_date: string; // ISO 8601 date string
    creator: User;
    participants: User[];
    completion_status: ChallengeCompletionStatus;
    has_new_submissions: boolean;
}

/**
 * Represents a challenge invite with all its details
 */
export interface ChallengeInvite extends Challenge {
    invitation_id: string;
    sender: User;
}