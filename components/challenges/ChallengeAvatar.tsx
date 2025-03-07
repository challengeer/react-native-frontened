import { View, Pressable } from "react-native";
import Text from "@/components/common/Text";
import { LinearGradient } from 'expo-linear-gradient';

interface ChallengeAvatarProps {
    emoji: string;
    hasNewSubmissions?: boolean;
    size?: 'md' | 'lg';
    onPress?: () => void;
}

export default function ChallengeAvatar({
    emoji,
    hasNewSubmissions = false,
    size = 'md',
    onPress
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
            padding: 3,
            gapPadding: "p-1"
        }
    };

    const EmojiView = (
        <Pressable onPress={onPress}>
            <View className={`flex-1 items-center justify-center ${sizeClasses[size].gapPadding} rounded-full bg-white dark:bg-neutral-900`}>
                <View className={`${sizeClasses[size].container} flex-1 items-center justify-center rounded-full bg-white dark:bg-neutral-800`}>
                    <Text className={`text-white font-medium ${sizeClasses[size].text}`}>{emoji}</Text>
                </View>
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
