import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useHistory() {
    const { data: history, isPending: isHistoryLoading, isError: isHistoryError, refetch: refetchHistory } = useQuery({
        queryKey: ["challenges-history"],
        queryFn: async () => {
            const response = await api.get("/challenges/history");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        history,
        isHistoryLoading,
        isHistoryError,
        refetchHistory,
    };
}