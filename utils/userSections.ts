import i18n from "@/i18n";
import { User, Friend, FriendRequest } from "@/types/user";
import { ContactRecommendation } from "@/types/contact";

export interface Section {
    title: string;
    data: (FriendRequest | Friend | ContactRecommendation | User)[];
}

function filterBySearch<T extends { display_name?: string; username?: string; contact_name?: string; phone_number?: string }>(
    items: T[] | undefined,
    searchQuery: string
): T[] | undefined {
    if (!searchQuery || !items) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
        (item.display_name?.toLowerCase().includes(query)) ||
        (item.username?.toLowerCase().includes(query)) ||
        (item.contact_name?.toLowerCase().includes(query)) ||
        (item.phone_number?.includes(query))
    );
}

export function organizeUsersIntoSections({
    searchResults,
    friendRequestsReceived,
    friendRequestsSent,
    recommendations,
    contacts,
    friends,
    searchQuery,
}: {
    searchResults?: User[];
    friendRequestsReceived?: FriendRequest[];
    friendRequestsSent?: FriendRequest[];
    recommendations?: User[];
    contacts?: ContactRecommendation[];
    friends?: Friend[];
    searchQuery: string;
}): Section[] {
    const sections: Section[] = [];
    
    // Apply search filters to all sections
    const filteredFriendRequestsReceived = filterBySearch(friendRequestsReceived, searchQuery);
    const filteredFriendRequestsSent = filterBySearch(friendRequestsSent, searchQuery);
    const filteredRecommendations = filterBySearch(recommendations, searchQuery);
    const filteredContacts = filterBySearch(contacts, searchQuery)?.slice(0, 20); // Keep the 20 contacts limit
    const filteredFriends = filterBySearch(friends, searchQuery);
    
    if (searchQuery && searchResults?.length) {
        // Get friend IDs for filtering search results
        const friendIds = new Set((filteredFriends || []).map(f => f.user_id));
        
        // Split search results into friends and non-friends
        const friendSearchResults = searchResults.filter(user => friendIds.has(user.user_id));
        const nonFriendSearchResults = searchResults.filter(user => !friendIds.has(user.user_id));

        // Filter out users that are already in other sections
        const existingUserIds = new Set([
            ...(filteredFriendRequestsReceived || []).map(r => r.user_id),
            ...(filteredFriendRequestsSent || []).map(r => r.user_id),
            ...(filteredRecommendations || []).map(r => r.user_id),
            ...(filteredContacts || []).map(c => c.contact_id),
        ]);

        const filteredNonFriendSearchResults = nonFriendSearchResults.filter(user => !existingUserIds.has(user.user_id));
        
        // Add friends section first if there are friend search results
        if (friendSearchResults.length > 0) {
            sections.push({
                title: i18n.t("friends.friends"),
                data: friendSearchResults,
            });
        }

        // Add other search results
        if (filteredNonFriendSearchResults.length > 0) {
            sections.push({
                title: i18n.t("friends.moreResults"),
                data: filteredNonFriendSearchResults,
            });
        }
    }

    if (filteredFriendRequestsReceived?.length) {
        sections.push({
            title: i18n.t("friends.requests.received"),
            data: filteredFriendRequestsReceived,
        });
    }

    if (filteredFriendRequestsSent?.length) {
        sections.push({
            title: i18n.t("friends.requests.sent"),
            data: filteredFriendRequestsSent,
        });
    }

    if (filteredRecommendations?.length) {
        sections.push({
            title: i18n.t("friends.recommendations"),
            data: filteredRecommendations,
        });
    }

    if (filteredContacts?.length) {
        sections.push({
            title: i18n.t("friends.contacts"),
            data: filteredContacts,
        });
    }

    return sections;
} 