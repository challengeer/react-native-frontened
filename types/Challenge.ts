import { UserInterface } from "@/types/User";

export interface Challenge {
    challenge_id: string;
    title: string;
    description: string;
    emoji: string;
    category: string;
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
}
