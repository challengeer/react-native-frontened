import UserInterface from "@/types/UserInterface";

export interface Challenge {
    challenge_id: string;
    title: string;
    description: string;
    emoji: string;
    category: string;
    created_at: string;
    end_date: string;
    creator: UserInterface;
    participants: UserInterface[];
    has_new_submissions: boolean;
}

export interface ChallengeSimple {
    challenge_id: string;
    title: string;
    emoji: string;
    category: string;
    end_date: string;
    has_new_submissions: boolean;
}
