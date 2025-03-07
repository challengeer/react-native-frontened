import { SafeAreaView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/common/Text";
import Avatar from "@/components/common/Avatar";
import { XMarkIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SubmissionPage() {
    const { submission_id } = useLocalSearchParams<{ submission_id: string }>();
    // const insets = useSafeAreaInsets();

    const { data, isLoading } = useQuery({
        queryKey: ["submission", submission_id],
        queryFn: async () => {
            const respone = await api.get(`/challenges/${submission_id}/submissions`);
            console.log(respone);
            return respone.data;
        },
    });

    const currentIndex = 0;
    const totalPhotos = data?.length || 0;
    const currentSubmission = data?.[currentIndex];

    return (
        <SafeAreaView className="mt-10">  {/* added mt-10 so that the photo does not take the notification bar */}
            <View className="absolute top-0 left-0 right-0 z-10">
                {/* Step indicators */}
                <View className="px-4 mb-4 mt-6">
                    <View className="flex-row gap-1">
                        {[...Array(totalPhotos)].map((_, index) => (
                            <View
                                key={index}
                                className={`h-0.5 flex-1 rounded-full ${index === currentIndex
                                    ? "bg-white"
                                    : "bg-white/30"
                                    }`}
                            />
                        ))}
                    </View>
                </View>

                {/* User info and close button */}
                <View className="flex-row items-center justify-between px-4">
                    <View className="flex-row items-center gap-2">
                        <Avatar
                            size="sm"
                            source={currentSubmission?.user?.profile_picture}
                            name={currentSubmission?.user?.display_name || "User"}
                        />
                        <View className="flex-row gap-4">
                            <Text className="text-base">
                                {currentSubmission?.user?.display_name || "User"}

                            </Text>
                            <Text type="secondary" className="text-base">
                                3h ago
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-8 h-8 items-center justify-center rounded-full bg-black/20"
                    >
                        <XMarkIcon color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* The photo of the current submission */}
            <Image
                source={{ uri: data?.[0].photo_url }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
            />
        </SafeAreaView>
    );
}
