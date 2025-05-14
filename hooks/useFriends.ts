import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import UserInterface from "@/types/UserInterface";

interface Friend extends UserInterface {
    mutual_streak: number;
}

interface FriendRequest extends UserInterface {
    request_id: string;
    status: "pending" | "accepted" | "rejected";
}

export function useFriends() {
    const { data: friends, isPending: isFriendsLoading, isError: isFriendsError, refetch: refetchFriends } = useQuery<Friend[]>({
        queryKey: ["friends"],
        queryFn: async () => {
            const response = await api.get("/friends/list");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: friendRequests, isPending: isFriendRequestsLoading, isError: isFriendRequestsError, refetch: refetchFriendRequests } = useQuery<FriendRequest[]>({
        queryKey: ["friend-requests"],
        queryFn: async () => {
            const response = await api.get("/friends/requests");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        friends,
        isFriendsLoading,
        isFriendsError,
        refetchFriends,
        friendRequests,
        isFriendRequestsLoading,
        isFriendRequestsError,
        refetchFriendRequests
    };
}