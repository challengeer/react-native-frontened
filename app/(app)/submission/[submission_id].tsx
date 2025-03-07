import api from "@/lib/api";
import { SafeAreaView, View, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native-gesture-handler";
import { XMarkIcon } from "react-native-heroicons/outline";
import Avatar from "@/components/common/Avatar";
import Text from "@/components/common/Text";

export default function SubmissionPage() {
    const { submission_id } = useLocalSearchParams<{ submission_id: string }>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ["submission", submission_id],
        queryFn: async () => {
            const respone = await api.get(`/challenges/${submission_id}/submissions`);
            console.log(respone);
            return respone.data;
        },
    });

    const totalPhotos = data?.length || 0;
    const currentSubmission = data?.[currentIndex];

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < totalPhotos - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // If we're at the last photo, go back
            router.back();
        }
    };

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
                        className="w-8 h-8 items-center justify-center rounded-full"
                    >
                        <XMarkIcon color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Navigation touch areas */}
            <View className="flex-1 flex-row absolute inset-0 z-20">
                <Pressable
                    className="w-1/2 h-full"
                    onPress={handlePrevious}
                />
                <Pressable
                    className="w-1/2 h-full"
                    onPress={handleNext}
                />
            </View>

            {/* The photo of the current submission */}
            <Image
                source={{ uri: currentSubmission?.photo_url }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
            />
        </SafeAreaView>
    );
}
