import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

import { Challenge } from "@/types/challenge";

export function useHistory() {
    const { data: history, isPending: isHistoryLoading, isError: isHistoryError, refetch: refetchHistory } = useQuery<Challenge[]>({
        queryKey: ["challenges-history"],
        queryFn: async () => {
            const response = await api.get("/challenges/history");
            return response.data;
        },
    });

    return {
        history,
        isHistoryLoading,
        isHistoryError,
        refetchHistory,
    };
}