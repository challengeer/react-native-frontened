/**
 * Represents a unique identifier for a user
 */
export type UserId = string;

/**
 * Base user interface with public information
 */
export interface User {
    user_id: UserId;
    display_name: string;
    username: string;
    profile_picture?: string;
}

/**
 * Extended user interface with private information
 */
export interface UserPrivate extends User {
    email?: string;
    phone_number?: string;
}

/**
 * Represents a friend relationship with mutual streak information
 */
export interface Friend extends User {
    mutual_streak: number;
}

/**
 * Represents the possible statuses of a friend request
 */
export type FriendRequestStatus = "pending" | "accepted" | "rejected";

/**
 * Represents a friend request with its status
 */
export interface FriendRequest extends User {
    request_id: string;
    status: FriendRequestStatus;
}

/**
 * Represents the possible states of a friendship
 */
export type FriendshipStatus = "friends" | "request_sent" | "request_received" | "none"; 