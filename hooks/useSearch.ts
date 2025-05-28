import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import UserInterface from "@/types/UserInterface";

export function useSearch(searchQuery: string) {
    const { data: searchResults, isPending: isSearchLoading, isError: isSearchError, refetch: refetchSearch } = useQuery<UserInterface[]>({
        queryKey: ["user-search", searchQuery],
        queryFn: async () => {
            if (!searchQuery) return [];
            const response = await api.get(`/user/search?q=${encodeURIComponent(searchQuery)}`);
            return response.data;
        },
    });

    return {
        searchResults,
        isSearchLoading,
        isSearchError,
        refetchSearch,
    };
} 