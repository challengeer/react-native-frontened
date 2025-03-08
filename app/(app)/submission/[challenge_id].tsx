import api from "@/lib/api";
import { View, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon } from "react-native-heroicons/outline";
import Avatar from "@/components/common/Avatar";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";

export default function SubmissionPage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ["submission", challenge_id],
        queryFn: async () => {
            const respone = await api.get(`/challenges/${challenge_id}/submissions`);
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
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 relative">
                <Image
                    source={{ uri: currentSubmission?.photo_url }}
                    style={{ width: "100%", height: "100%", borderRadius: 24 }}
                    contentFit="cover"
                />

                <View className="flex-1 flex-row absolute inset-0">
                    <Pressable
                        className="w-1/2 h-full"
                        onPress={handlePrevious}
                    />
                    <Pressable
                        className="w-1/2 h-full"
                        onPress={handleNext}
                    />
                </View>

                <LinearGradient
                    colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                    style={{ position: "absolute", top: 0, left: 0, right: 0 }}
                >
                    <View className="px-4 py-6 gap-4">
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

                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <Avatar
                                    size="sm"
                                    source={currentSubmission?.user?.profile_picture}
                                    name={currentSubmission?.user?.display_name || "User"}
                                />

                                <View>
                                    <Text className="leading-tight font-medium">
                                        {currentSubmission?.user?.display_name || "User"}
                                    </Text>
                                    <Text className="leading-tight text-base opacity-50">
                                        3h ago
                                    </Text>
                                </View>
                            </View>

                            <Pressable onPress={() => router.back()} className="-m-4 p-4">
                                <Icon
                                    icon={XMarkIcon}
                                    lightColor="#fff"
                                    darkColor="#fff"
                                />
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
}
