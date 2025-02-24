import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { FriendshipStatus } from "@/types/FriendshipTypes";

export function useFriendActions() {
    const queryClient = useQueryClient();

    const addFriend = useMutation({
        mutationFn: async (userId: string) => {
            await api.post("/friends/add", { receiver_id: userId });
        },
        onMutate: async (userId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["user", userId] });

            // Update user profile if viewing
            queryClient.setQueryData(["user", userId], (old: any) => 
                old ? { ...old, friendship_status: "request_sent" as FriendshipStatus } : old
            );

            // Update search results if present
            queryClient.setQueryData(["user-search"], (old: any[]) =>
                old?.map(user => user.user_id === userId ? 
                    { ...user, friendship_status: "request_sent" as FriendshipStatus } : user
                )
            );

            return { userId };
        },
        onError: (err, userId) => {
            // Only invalidate affected queries
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
            queryClient.invalidateQueries({ queryKey: ["user-search"] });
        },
        // Only invalidate user-related queries since friend lists aren't affected yet
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["user-search"] });
        },
    });

    const acceptRequest = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/accept", { request_id: requestId });
        },
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friend-requests'] });
            const previousRequests = queryClient.getQueryData(['friend-requests']);
            
            queryClient.setQueryData(['friend-requests'], (old: any[]) => 
                old?.filter(request => request.request_id !== requestId)
            );
            
            return { previousRequests };
        },
        onError: (err, requestId, context) => {
            queryClient.setQueryData(['friend-requests'], context?.previousRequests);
        },
        // Only invalidate friend-related queries since the request was accepted
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
    });

    const rejectRequest = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/reject", { request_id: requestId });
        },
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friend-requests'] });
            const previousRequests = queryClient.getQueryData(['friend-requests']);
            
            queryClient.setQueryData(['friend-requests'], (old: any[]) => 
                old?.filter(request => request.request_id !== requestId)
            );
            
            return { previousRequests };
        },
        onError: (err, requestId, context) => {
            queryClient.setQueryData(['friend-requests'], context?.previousRequests);
        },
        // Only invalidate friend requests since we're just removing one
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
        },
    });

    return {
        addFriend,
        acceptRequest,
        rejectRequest,
    };
} 