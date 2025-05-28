import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import { Submission } from "@/types/submission";

export const useSubmissions = (challenge_id: string) => {
    const queryClient = useQueryClient();

    const { data: submissions, isPending: isSubmissionsLoading, isError: isSubmissionsError } = useQuery<Submission[]>({
        queryKey: ["submissions", challenge_id],
        queryFn: async () => {
            const response = await api.get(`/challenges/${challenge_id}/submissions`);

            // prefetch all images
            Promise.all(
                response.data.map((submission: any) =>
                    ExpoImage.prefetch(submission.photo_url)
                )
            );

            queryClient.refetchQueries({ queryKey: ["challenges"] });
            queryClient.refetchQueries({ queryKey: ["challenge", challenge_id] });

            return response.data;
        },
    })

    return { submissions, isSubmissionsLoading, isSubmissionsError };
};