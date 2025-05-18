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
            // Cancel any outgoing refetches
            await Promise.all([
                queryClient.cancelQueries({ queryKey: ["user", userId] }),
                queryClient.cancelQueries({ queryKey: ["user-search"] }),
                queryClient.cancelQueries({ queryKey: ["friends"] }),
                queryClient.cancelQueries({ queryKey: ["friend-requests"] })
            ]);

            // Snapshot the previous value
            const previousUserData = queryClient.getQueryData(["user", userId]);
            const previousSearchData = queryClient.getQueryData(["user-search"]);

            // Optimistically update user profile
            queryClient.setQueryData(["user", userId], (old: any) => 
                old ? { ...old, friendship_status: "request_sent" as FriendshipStatus } : old
            );

            // Optimistically update search results
            queryClient.setQueryData(["user-search"], (old: any[]) =>
                old?.map(user => user.user_id === userId ? 
                    { ...user, friendship_status: "request_sent" as FriendshipStatus } : user
                )
            );

            return { previousUserData, previousSearchData, userId };
        },
        onError: (err, userId, context) => {
            console.log(err.response.data);
            // Rollback on error
            if (context?.previousUserData) {
                queryClient.setQueryData(["user", userId], context.previousUserData);
            }
            if (context?.previousSearchData) {
                queryClient.setQueryData(["user-search"], context.previousSearchData);
            }
        },
        onSettled: () => {
            // Refetch all affected queries
            queryClient.refetchQueries({ queryKey: ["user-search"] });
            queryClient.refetchQueries({ queryKey: ["friends"] });
            queryClient.refetchQueries({ queryKey: ["friend-requests"] });
        },
    });

    const acceptRequest = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/accept", { request_id: requestId });
        },
        onMutate: async (requestId) => {
            // Cancel any outgoing refetches
            await Promise.all([
                queryClient.cancelQueries({ queryKey: ['friend-requests'] }),
                queryClient.cancelQueries({ queryKey: ['friends'] })
            ]);

            // Snapshot the previous values
            const previousRequests = queryClient.getQueryData(['friend-requests']);
            const previousFriends = queryClient.getQueryData(['friends']);

            // Optimistically update friend requests
            queryClient.setQueryData(['friend-requests'], (old: any[]) => 
                old?.filter(request => request.request_id !== requestId)
            );

            // Optimistically update friends list
            const request = (previousRequests as any[])?.find(r => r.request_id === requestId);
            if (request) {
                queryClient.setQueryData(['friends'], (old: any[]) => 
                    old ? [...old, { ...request, friendship_status: "friends" }] : [request]
                );
            }
            
            return { previousRequests, previousFriends, requestId };
        },
        onError: (err, requestId, context) => {
            // Rollback on error
            if (context?.previousRequests) {
                queryClient.setQueryData(['friend-requests'], context.previousRequests);
            }
            if (context?.previousFriends) {
                queryClient.setQueryData(['friends'], context.previousFriends);
            }
        },
        onSettled: () => {
            // Refetch all affected queries
            queryClient.refetchQueries({ queryKey: ['friend-requests'] });
            queryClient.refetchQueries({ queryKey: ['friends'] });
        },
    });

    const rejectRequest = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/reject", { request_id: requestId });
        },
        onMutate: async (requestId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['friend-requests'] });
            
            // Snapshot the previous value
            const previousRequests = queryClient.getQueryData(['friend-requests']);
            
            // Optimistically update friend requests
            queryClient.setQueryData(['friend-requests'], (old: any[]) => 
                old?.filter(request => request.request_id !== requestId)
            );
            
            return { previousRequests, requestId };
        },
        onError: (err, requestId, context) => {
            // Rollback on error
            if (context?.previousRequests) {
                queryClient.setQueryData(['friend-requests'], context.previousRequests);
            }
        },
        onSettled: () => {
            // Refetch friend requests
            queryClient.refetchQueries({ queryKey: ['friend-requests'] });
        },
    });

    return {
        addFriend,
        acceptRequest,
        rejectRequest,
    };
} 