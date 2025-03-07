import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useChallengeActions() {
    const queryClient = useQueryClient();

    const acceptInvite = useMutation({
        mutationFn: async (invitationId: string) => {
            await api.put("/challenges/accept", { invitation_id: invitationId });
        },
        onMutate: async (invitationId) => {
            await queryClient.cancelQueries({ queryKey: ['challenges'] });
            const previousChallenges = queryClient.getQueryData(['challenges']);
            
            queryClient.setQueryData(['challenges'], (old: any) => {
                if (!old) return old;
                
                // Find the invitation that's being accepted
                const acceptedInvite = old.invitations?.find(
                    (invite: any) => invite.invitation_id === invitationId
                );

                return {
                    ...old,
                    // Remove the invitation from invitations array
                    invitations: old.invitations?.filter(
                        (invite: any) => invite.invitation_id !== invitationId
                    ),
                    // Add the challenge to challenges array
                    challenges: [...(old.challenges || []), ...acceptedInvite]
                };
            });
            
            return { previousChallenges };
        },
        onError: (err, invitationId, context) => {
            queryClient.setQueryData(['challenges'], context?.previousChallenges);
        },
        // Only invalidate friend-related queries since the request was accepted
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
    });

    const rejectInvite = useMutation({
        mutationFn: async (invitationId: string) => {
            await api.put("/challenges/reject", { invitation_id: invitationId });
        },
        onMutate: async (invitationId) => {
            await queryClient.cancelQueries({ queryKey: ['challenges'] });
            const previousChallenges = queryClient.getQueryData(['challenges']);
            
            queryClient.setQueryData(['challenges'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    invitations: old.invitations?.filter((invite: any) => invite.invitation_id !== invitationId)
                };
            });
            
            return { previousChallenges };
        },
        onError: (err, invitationId, context) => {
            queryClient.setQueryData(['challenges'], context?.previousChallenges);
        },
        // Only invalidate friend requests since we're just removing one
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        },
    });

    return {
        acceptInvite,
        rejectInvite,
    };
} 