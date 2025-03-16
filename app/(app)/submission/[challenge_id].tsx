import api from "@/lib/api";
import { View, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon, ArrowLeftIcon } from "react-native-heroicons/outline";
import Avatar from "@/components/common/Avatar";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";

export default function SubmissionPage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data, isPending } = useQuery({
        queryKey: ['submissions', challenge_id],
        queryFn: async () => {
            try {
                const response = await api.get(`/challenges/${challenge_id}/submissions`);

                // prefetch all images
                await Promise.all(
                    response.data.map((submission: any) =>
                        ExpoImage.prefetch(submission.photo_url)
                    )
                );

                return response.data;
            } catch (error) {
                await ExpoImage.prefetch(`https://picsum.photos/seed/${challenge_id}/100/150`);
                return [];
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const totalPhotos = data?.length || 0;
    const currentSubmission = data?.[currentIndex];

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

    if (isPending) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (data?.length === 0) {
        return (
            <View className="flex-1 relative">
                <ExpoImage
                    source={{ uri: `https://picsum.photos/seed/${challenge_id}/100/150` }}
                    style={{ width: "100%", height: "100%", borderRadius: 24, opacity: 0.8 }}
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
        <View className="flex-1 relative">
            <ExpoImage
                source={{ uri: currentSubmission?.photo_url }}
                style={{ width: "100%", height: "100%", borderRadius: 24 }}
                contentFit="cover"
            />

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
                style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}
                pointerEvents="box-none"
            >
                <View className="px-4 py-6 gap-4">
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
                                size="sm"
                                source={currentSubmission?.user?.profile_picture}
                                name={currentSubmission?.user?.display_name || "User"}
                            />

                            <View>
                                <Text className="leading-tight font-medium">
                                    {currentSubmission?.user?.display_name || "User"}
                                </Text>
                                <Text className="leading-tight text-base opacity-80">
                                    {currentSubmission?.submitted_at}
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
