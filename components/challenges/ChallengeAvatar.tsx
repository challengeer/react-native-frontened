import { View, Pressable, GestureResponderEvent } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import Text from "@/components/common/Text";

interface ChallengeAvatarProps {
    challengeId: string;
    emoji: string;
    hasNewSubmissions?: boolean;
    isInvitation?: boolean;
    size?: "md" | "lg";
}

export default function ChallengeAvatar({
    challengeId,
    emoji,
    hasNewSubmissions = false,
    isInvitation = false,
    size = "md",
}: ChallengeAvatarProps) {
    const sizeClasses = {
        md: {
            container: "w-14 h-14",
            text: "text-2xl",
            padding: 2.5,
            gapPadding: "p-0.5"
        },
        lg: {
            container: "w-32 h-32",
            text: "text-6xl",
            padding: 3.5,
            gapPadding: "p-1"
        }
    };

    const handlePress = (event: GestureResponderEvent) => {
        if (isInvitation) return;
        router.push({
            pathname: "/(app)/submission/[challenge_id]",
            params: {
                challenge_id: challengeId,
                x: event.nativeEvent.pageX.toString(),
                y: event.nativeEvent.pageY.toString()
            }
        });
    };

    const EmojiView = (
        <Pressable
            className={`items-center justify-center ${sizeClasses[size].gapPadding} rounded-full bg-white dark:bg-neutral-900`}
            onPress={handlePress}
        >
            <View className={`${sizeClasses[size].container} items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800`}>
                <Text className={`text-white font-medium leading-loose ${sizeClasses[size].text}`}>{emoji}</Text>
            </View>
        </Pressable>
    );

    if (hasNewSubmissions) {
        return (
            <LinearGradient
                colors={['#6366F1', '#A855F7', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    borderRadius: 1000,
                    padding: sizeClasses[size].padding,
                }}
            >
                {EmojiView}
            </LinearGradient>
        );
    }

    return (
        <View
            className="rounded-full bg-neutral-100 dark:bg-neutral-800"
            style={{ padding: sizeClasses[size].padding }}
        >
            {EmojiView}
        </View>
    );
}
