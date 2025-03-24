import i18n from "@/i18n";
import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { getTimeLeft } from "@/utils/timeUtils";
import Text from "@/components/common/Text";
import Avatar from "@/components/common/Avatar";
import ChallengeAvatar from "@/components/challenges/ChallengeAvatar";
import UserInterface from "@/types/UserInterface";

interface ChallengesItemProps {
    index?: number;
    challengeId: string;
    title: string;
    emoji: string;
    category: string;
    endDate: string;
    hasNewSubmissions?: boolean;
    sender?: UserInterface;
    rightSection?: React.ReactNode;
}

export default function ChallengeItem({
    index,
    challengeId,
    title,
    emoji,
    category,
    endDate,
    hasNewSubmissions = false,
    sender,
    rightSection
}: ChallengesItemProps) {
    return (
        <View className={`px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}>
            {sender && (
                <Pressable className="flex-row items-center gap-2 mb-2" onPress={() => router.push(`/(app)/user/${sender.user_id}`)}>
                    <Avatar
                        size="xs"
                        name={sender.display_name}
                        source={sender.profile_picture}
                    />

                    <Text type="secondary" className="text-sm">
                        {i18n.t("challenges.invitations.description", { display_name: sender.display_name })}
                    </Text>
                </Pressable>
            )}

            <Pressable
                className="flex-row items-center gap-3"
                onPress={() => router.push(`/(app)/challenge/${challengeId}`)}
            >
                <ChallengeAvatar
                    challengeId={challengeId}
                    emoji={emoji}
                    hasNewSubmissions={hasNewSubmissions}
                    size="md"
                />

                <View className="flex-1">
                    <Text className="text-lg font-medium line-clamp-1">{title}</Text>
                    <Text type="secondary" className="text-base">{category} &middot; {getTimeLeft(endDate)}</Text>
                </View>

                {rightSection}
            </Pressable>
        </View>
    )
}
