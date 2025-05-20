import { useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useFriends } from "@/hooks/useFriends";
import { useContacts } from "@/hooks/useContacts";
import { organizeUsersIntoSections } from "@/utils/userSections";

export function useFriendsList(search: string) {
    const { searchResults, isSearchLoading, isSearchError, refetchSearch } = useSearch(search);
    const { 
        friendRequestsReceived, 
        friendRequestsSent, 
        isFriendRequestsReceivedLoading,
        isFriendRequestsSentLoading,
        isFriendRequestsReceivedError,
        isFriendRequestsSentError,
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
        friendRequestsReceived,
        friendRequestsSent,
        recommendations,
        contacts,
        searchQuery: search,
    }), [searchResults, friendRequestsReceived, friendRequestsSent, recommendations, contacts, search]);

    return {
        sections,
        isLoading: isSearchLoading || isFriendRequestsReceivedLoading || isFriendRequestsSentLoading || isContactsLoading || isRecommendationsLoading,
        isError: isSearchError || isFriendRequestsReceivedError || isFriendRequestsSentError || isContactsError || isRecommendationsError,
        refetch: () => {
            refetchSearch();
            refetchFriendRequestsReceived();
            refetchFriendRequestsSent();
            refetchContacts();
            refetchRecommendations();
        }
    };
} 