import { View, Pressable } from "react-native";
import { router } from "expo-router";
import Text from "@/components/common/Text";
import ChallengeActionButton from "./ChallengeActionButton";
import Avatar from "@/components/common/Avatar";
import ChallengeAvatar from "./ChallengeAvatar";

interface ChallengesItemProps {
    index?: number;
    challengeId: string;
    title: string;
    emoji: string;
    category: string;
    endDate: string;
    hasNewSubmissions?: boolean;
    showActions?: boolean;
    onJoin?: () => void;
    onCancel?: () => void;
    notification?: string;
}

export default function ChallengeItem({
    index,
    challengeId,
    title,
    emoji,
    category,
    endDate,
    hasNewSubmissions = true,
    showActions = false,
    onJoin,
    onCancel,
    notification
}: ChallengesItemProps) {
    const formattedEndDate = `${Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours left`

    return (
        <View className={`px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}>
            {notification && (
                <View className="flex-row items-center gap-2 mb-2">
                    <Avatar size="xs" name="John Doe" />
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">{notification}</Text>
                </View>
            )}

            <Pressable
                className="flex-row items-center gap-3"
                onPress={() => router.push(`/(app)/challenge/${challengeId}`)}
            >
                <ChallengeAvatar 
                    emoji={emoji} 
                    hasNewSubmissions={hasNewSubmissions}
                    size="md"
                />

                <View className="flex-1">
                    <Text className="text-lg font-medium">{title}</Text>
                    <Text type="secondary" className="text-base">{category} &middot; {formattedEndDate}</Text>
                </View>
                
                {showActions && <ChallengeActionButton onJoin={onJoin} onCancel={onCancel} title="Join" />}
            </Pressable>
        </View>
    )
}
