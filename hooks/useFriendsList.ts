import { useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useFriends } from "@/hooks/useFriends";
import { useContacts } from "@/hooks/useContacts";
import { organizeUsersIntoSections } from "@/utils/userSections";

export function useFriendsList(search: string) {
    const { searchResults, isSearchLoading, isSearchError, refetchSearch } = useSearch(search);
    const { 
        friends,
        friendRequestsReceived, 
        friendRequestsSent, 
        isFriendsLoading,
        isFriendRequestsReceivedLoading,
        isFriendRequestsSentLoading,
        isFriendsError,
        isFriendRequestsReceivedError,
        isFriendRequestsSentError,
        refetchFriends,
        refetchFriendRequestsReceived,
        refetchFriendRequestsSent
    } = useFriends();
    const { 
        contacts, 
        recommendations, 
        isContactsLoading,
        isRecommendationsLoading,
        isContactsError,
        isRecommendationsError,
        refetchContacts,
        refetchRecommendations
    } = useContacts();

    const sections = useMemo(() => organizeUsersIntoSections({
        searchResults,
        friends,
        friendRequestsReceived,
        friendRequestsSent,
        recommendations,
        contacts,
        searchQuery: search,
    }), [searchResults, friends, friendRequestsReceived, friendRequestsSent, recommendations, contacts, search]);

    return {
        sections,
        isLoading: isSearchLoading || isFriendsLoading || isFriendRequestsReceivedLoading || isFriendRequestsSentLoading || isContactsLoading || isRecommendationsLoading,
        isError: isSearchError || isFriendsError || isFriendRequestsReceivedError || isFriendRequestsSentError || isContactsError || isRecommendationsError,
        refetch: () => {
            refetchSearch();
            refetchFriends();
            refetchFriendRequestsReceived();
            refetchFriendRequestsSent();
            refetchContacts();
            refetchRecommendations();
        }
    };
} 