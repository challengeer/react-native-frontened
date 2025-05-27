import { View, ActivityIndicator } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useLocalSearchParams, router } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { useCallback, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon, ArrowLeftIcon } from "react-native-heroicons/outline";
import { useSubmissions } from "@/hooks/useSubmissions";
import { getTimeAgo } from "@/utils/timeUtils";
import Avatar from "@/components/common/Avatar";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import Overlays from "@/components/submission/Overlays";

export default function SubmissionPage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const { submissions, isSubmissionsLoading, isSubmissionsError } = useSubmissions(challenge_id);
    const [currentIndex, setCurrentIndex] = useState(0);

    const totalPhotos = submissions?.length || 0;
    const currentSubmission = submissions?.[currentIndex];

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const handleNext = useCallback(() => {
        if (currentIndex < totalPhotos - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // If we're at the last photo, go back
            router.back();
        }
    }, [currentIndex, totalPhotos]);

    if (isSubmissionsLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (isSubmissionsError) {
        return (
            <View className="w-full aspect-[9/16] relative">
                <ExpoImage
                    source={{ uri: `https://picsum.photos/seed/${challenge_id}/100/150` }}
                    style={{ width: "100%", height: "100%", opacity: 0.8 }}
                    contentFit="cover"
                    blurRadius={5}
                />

                <Pressable className="absolute top-6 left-6 -m-4 p-4" onPress={() => router.back()}>
                    <Icon
                        icon={ArrowLeftIcon}
                        lightColor="#fff"
                        darkColor="#fff"
                    />
                </Pressable>

                <View className="absolute inset-0 items-center justify-center p-6">
                    <Text className="text-white text-center text-2xl font-bold mb-2">
                        Upload your photo first
                    </Text>
                    <Text className="text-white opacity-80 text-center text-base font-medium mb-4">
                        You need to submit your result to see other people photos
                    </Text>
                    <Button
                        title="Upload photo"
                        onPress={() => router.push(`/(app)/camera?challenge_id=${challenge_id}`)}
                    />
                </View>
            </View>
        );
    }

    return (
        <View className="w-full aspect-[9/16] relative">
            <ExpoImage
                source={{ uri: currentSubmission?.photo_url }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
            />

            {currentSubmission?.overlays && (
                <Overlays
                    overlays={currentSubmission.overlays}
                />
            )}

            <View
                className="absolute inset-0 flex-row"
                style={{ zIndex: 10 }}
                pointerEvents="box-none"
            >
                <Pressable
                    className="flex-1 w-1/2 h-full"
                    onPress={handlePrevious}
                />
                <Pressable
                    className="flex-1 w-1/2 h-full"
                    onPress={handleNext}
                />
            </View>

            <LinearGradient
                colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 40 }}
                pointerEvents="box-none"
            >
                <View className="p-4 gap-4">
                    <View className="flex-row h-0.5 gap-1">
                        {[...Array(totalPhotos)].map((_, index) => (
                            <View
                                key={index}
                                className={`flex-1 rounded-full ${index === currentIndex
                                    ? "bg-white"
                                    : "bg-white/30"
                                    }`}
                            />
                        ))}
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Pressable
                            className="flex-row items-center gap-3"
                            onPress={() => router.push(`/(app)/user/${currentSubmission?.user?.user_id}`)}
                        >
                            <Avatar
                                size="xs"
                                source={currentSubmission?.user?.profile_picture}
                                name={currentSubmission?.user?.display_name || "User"}
                            />

                            <View className="flex-row items-center gap-2">
                                <Text className="leading-tight font-medium">
                                    {currentSubmission?.user?.display_name || "User"}
                                </Text>
                                <Text className="leading-tight opacity-80">
                                    {getTimeAgo(currentSubmission?.submitted_at || "")}
                                </Text>
                            </View>
                        </Pressable>

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
    );
}
