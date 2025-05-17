import api from "@/lib/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import UserInterface from "@/types/UserInterface";

export interface Friend extends UserInterface {
    mutual_streak: number;
}

export interface FriendRequest extends UserInterface {
    request_id: string;
    status: "pending" | "accepted" | "rejected";
}

export function useFriends() {
    const queryClient = useQueryClient();

    const { data: friends, isPending: isFriendsLoading, isError: isFriendsError, refetch: refetchFriends } = useQuery<Friend[]>({
        queryKey: ["friends"],
        queryFn: async () => {
            const response = await api.get("/friends/list");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: friendRequestsReceived, isPending: isFriendRequestsReceivedLoading, isError: isFriendRequestsReceivedError, refetch: refetchFriendRequestsReceived } = useQuery<FriendRequest[]>({
        queryKey: ["friend-requests-received"],
        queryFn: async () => {
            const response = await api.get("/friends/requests/received");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: friendRequestsSent, isPending: isFriendRequestsSentLoading, isError: isFriendRequestsSentError, refetch: refetchFriendRequestsSent } = useQuery<FriendRequest[]>({
        queryKey: ["friend-requests-sent"],
        queryFn: async () => {
            const response = await api.get("/friends/requests/sent");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { mutate: addFriend, isPending: isAddingFriend } = useMutation({
        mutationFn: async (userId: string) => {
            await api.post("/friends/add", { receiver_id: userId });
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ["friends"] });
            queryClient.refetchQueries({ queryKey: ["friend-requests-sent"] });
        },
    });

    const { mutate: acceptRequest, isPending: isAcceptingRequest } = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/accept", { request_id: requestId });
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ['friends'] });
            queryClient.refetchQueries({ queryKey: ['friend-requests-received'] });
        },
    });

    const { mutate: rejectRequest, isPending: isRejectingRequest } = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/reject", { request_id: requestId });
        },
        onSettled: () => {
            queryClient.refetchQueries({ queryKey: ['friend-requests-received'] });
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