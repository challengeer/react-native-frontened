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
    searchQuery,
}: {
    searchResults?: User[];
    friendRequestsReceived?: FriendRequest[];
    friendRequestsSent?: FriendRequest[];
    recommendations?: User[];
    contacts?: ContactRecommendation[];
    searchQuery: string;
}): Section[] {
    const sections: Section[] = [];
    
    // Apply search filters to all sections
    const filteredFriendRequestsReceived = filterBySearch(friendRequestsReceived, searchQuery);
    const filteredFriendRequestsSent = filterBySearch(friendRequestsSent, searchQuery);
    const filteredRecommendations = filterBySearch(recommendations, searchQuery);
    const filteredContacts = filterBySearch(contacts, searchQuery)?.slice(0, 20); // Keep the 20 contacts limit
    
    if (searchQuery && searchResults?.length) {
        // Filter out users that are already in other sections
        const existingUserIds = new Set([
            ...(filteredFriendRequestsReceived || []).map(r => r.user_id),
            ...(filteredFriendRequestsSent || []).map(r => r.user_id),
            ...(filteredRecommendations || []).map(r => r.user_id),
            ...(filteredContacts || []).map(c => c.contact_id),
        ]);

        const filteredSearchResults = searchResults.filter(user => !existingUserIds.has(user.user_id));
        
        if (filteredSearchResults.length > 0) {
            sections.push({
                title: "Search Results",
                data: filteredSearchResults,
            });
        }
    }

    if (filteredFriendRequestsReceived?.length) {
        sections.push({
            title: "Received Requests",
            data: filteredFriendRequestsReceived,
        });
    }

    if (filteredFriendRequestsSent?.length) {
        sections.push({
            title: "Sent Requests",
            data: filteredFriendRequestsSent,
        });
    }

    if (filteredRecommendations?.length) {
        sections.push({
            title: "Recommendations",
            data: filteredRecommendations,
        });
    }

    if (filteredContacts?.length) {
        sections.push({
            title: "Contacts",
            data: filteredContacts,
        });
    }

    return sections;
} 