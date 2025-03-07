import i18n from "@/i18n";
import { View, Pressable } from "react-native";
import { router } from "expo-router";
import Text from "@/components/common/Text";
import ChallengeActionButton from "@/components/challenges/ChallengeActionButton";
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
    invitationId?: string;
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
    invitationId
}: ChallengesItemProps) {
    const formattedEndDate = `${Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours left`

    return (
        <View className={`px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}>
            {sender && (
                <Pressable className="flex-row items-center gap-2 mb-2" onPress={() => router.push(`/(app)/user/${sender.user_id}`)}>
                    <Avatar size="xs" name={sender.display_name} source={sender.profile_picture} />
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
                    emoji={emoji} 
                    hasNewSubmissions={hasNewSubmissions}
                    size="md"
                />

                <View className="flex-1">
                    <Text className="text-lg font-medium line-clamp-1">{title}</Text>
                    <Text type="secondary" className="text-base">{category} &middot; {formattedEndDate}</Text>
                </View>
                
                {invitationId && <ChallengeActionButton invitationId={invitationId} />}
            </Pressable>
        </View>
    )
}
