import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Challenge, ChallengeInvite } from "@/types/challenge";

export function useChallenges() {
    const queryClient = useQueryClient();

    const { data: challenges, isLoading: isChallengesLoading, isError: isChallengesError, refetch: refetchChallenges } = useQuery<Challenge[]>({
        queryKey: ["challenges"],
        queryFn: async () => {
            const response = await api.get("/challenges/list");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: challengeInvites, isLoading: isChallengeInvitesLoading, isError: isChallengeInvitesError, refetch: refetchChallengeInvites } = useQuery<ChallengeInvite[]>({
        queryKey: ["challenge-invites"],
        queryFn: async () => {
            const response = await api.get("/challenges/invites");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { mutate: acceptChallengeInvite, isPending: isAcceptingChallengeInvite } = useMutation({
        mutationFn: async (invitationId: string) => {
            await api.put(`/challenges/accept`, { invitation_id: invitationId });
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ["challenge-invites"] });
            queryClient.refetchQueries({ queryKey: ["challenges"] });
        },
    });

    const { mutate: rejectChallengeInvite, isPending: isRejectingChallengeInvite } = useMutation({
        mutationFn: async (invitationId: string) => {
            await api.put(`/challenges/reject`, { invitation_id: invitationId });
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ["challenge-invites"] });
            queryClient.refetchQueries({ queryKey: ["challenges"] });
        },
    });

    return {
        challenges,
        isChallengesLoading,
        isChallengesError,
        refetchChallenges,
        challengeInvites,
        isChallengeInvitesLoading,
        isChallengeInvitesError,
        refetchChallengeInvites,
        acceptChallengeInvite,
        rejectChallengeInvite,
        isAcceptingChallengeInvite,
        isRejectingChallengeInvite,
    };
}

export function useChallenge(challengeId: string) {
    const { data: challenge, isLoading: isChallengeLoading, isError: isChallengeError, refetch: refetchChallenge } = useQuery<Challenge>({
        queryKey: ["challenge", challengeId],
        queryFn: async () => {
            const response = await api.get(`/challenges/${challengeId}`);
            return response.data;
        },
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