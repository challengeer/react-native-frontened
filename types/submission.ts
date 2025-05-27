import { User } from "@/types/user";

/**
 * Submission is a type that represents a submission.
 */
export interface Submission {
    submission_id: string;
    photo_url: string;
    overlays: Overlay[];
    user: User;
    submitted_at: string;
}

/**
 * Overlay is a type that represents an overlay on the submission.
 */
export interface Overlay {
    overlay_id?: string;
    overlay_type: 'text';
    content: string;
    x: number;
    y: number;
}