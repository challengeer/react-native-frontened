import api from "@/lib/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { Friend, FriendRequest } from "@/types/user";

export function useFriends() {
    const queryClient = useQueryClient();

    const { data: friends, isPending: isFriendsLoading, isError: isFriendsError, refetch: refetchFriends } = useQuery<Friend[]>({
        queryKey: ["friends"],
        queryFn: async () => {
            const response = await api.get("/friends/list");
            return response.data;
        },
    });

    const { data: friendRequestsReceived, isPending: isFriendRequestsReceivedLoading, isError: isFriendRequestsReceivedError, refetch: refetchFriendRequestsReceived } = useQuery<FriendRequest[]>({
        queryKey: ["friend-requests-received"],
        queryFn: async () => {
            const response = await api.get("/friends/requests/received");
            return response.data;
        },
    });

    const { data: friendRequestsSent, isPending: isFriendRequestsSentLoading, isError: isFriendRequestsSentError, refetch: refetchFriendRequestsSent } = useQuery<FriendRequest[]>({
        queryKey: ["friend-requests-sent"],
        queryFn: async () => {
            const response = await api.get("/friends/requests/sent");
            return response.data;
        },
    });

    const { mutate: addFriend, isPending: isAddingFriend } = useMutation({
        mutationFn: async (userId: string) => {
            await api.post("/friends/add", { receiver_id: userId });
            return userId;
        },
        onSettled: (userId) => {
            if (!userId) return;

            queryClient.refetchQueries({ queryKey: ["friends"] });
            queryClient.refetchQueries({ queryKey: ["friend-requests-sent"] });
            queryClient.refetchQueries({ queryKey: ["contact-recommendations"] });
            queryClient.refetchQueries({ queryKey: ["user", userId] });
        },
    });

    const { mutate: acceptRequest, isPending: isAcceptingRequest } = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/accept", { request_id: requestId });
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ['friends'] });
            queryClient.refetchQueries({ queryKey: ['friend-requests-received'] });
            queryClient.refetchQueries({ queryKey: ['contact-recommendations'] });
        },
    });

    const { mutate: rejectRequest, isPending: isRejectingRequest } = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/reject", { request_id: requestId });
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ['friend-requests-received'] });
            queryClient.refetchQueries({ queryKey: ['contact-recommendations'] });
        },
    });

    return {
        friends,
        isFriendsLoading,
        isFriendsError,
        refetchFriends,
        friendRequestsReceived,
        isFriendRequestsReceivedLoading,
        isFriendRequestsReceivedError,
        refetchFriendRequestsReceived,
        friendRequestsSent,
        isFriendRequestsSentLoading,
        isFriendRequestsSentError,
        refetchFriendRequestsSent,
        addFriend,
        isAddingFriend,
        acceptRequest,
        isAcceptingRequest,
        rejectRequest,
        isRejectingRequest,
    };
}