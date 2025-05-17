import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useChallenges() {
    const { data: challenges, isLoading: isChallengesLoading, isError: isChallengesError, refetch: refetchChallenges } = useQuery({
        queryKey: ["challenges"],
        queryFn: () => api.get("/challenges/list"),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        challenges,
        isChallengesLoading,
        isChallengesError,
        refetchChallenges,
    };
}

export function useChallenge(challengeId: string) {
    const { data: challenge, isLoading: isChallengeLoading, isError: isChallengeError, refetch: refetchChallenge } = useQuery({
        queryKey: ["challenge", challengeId],
        queryFn: () => api.get(`/challenges/${challengeId}`),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!challengeId, // Only run the query if challengeId is provided
    });

    return {
        challenge,
        isChallengeLoading,
        isChallengeError,
        refetchChallenge,
    };
}