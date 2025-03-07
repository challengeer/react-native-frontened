import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Image } from "expo-image";

export default function SubmissionPage() {
    const { submission_id } = useLocalSearchParams<{ submission_id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ["submission", submission_id],
        queryFn: async () => {
            const respone = await api.get(`/challenges/${submission_id}/submissions`);
            console.log(respone);
            return respone.data;
        },
    });

    return (
        <View>
            <Image
                source={{ uri: data?.[0].photo_url }}
                style={{ width: "100%", height: "100%" }}
            />
        </View>
    )
}
