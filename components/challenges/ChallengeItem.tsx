import { View, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Text from "@/components/common/Text";
import ChallengeActionButton from "./ChallengeActionButton";
import Avatar from "@/components/common/Avatar";

interface ChallengesItemProps {
    title: string;
    type: string;
    text: string;
    time: string;
    onPress: () => void;
    isActive?: boolean;
    index?: number;
    showActions?: boolean;
    onJoin?: () => void;
    onCancel?: () => void;
    notification?: string;
}

export default function ChallengeItem({
    title,
    type,
    text,
    time,
    onPress,
    isActive = false,
    index,
    showActions = false,
    onJoin,
    onCancel,
    notification
}: ChallengesItemProps) {
    return (
        <View className={`px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}>
            {notification && (
                <View className="flex-row items-center gap-2 mb-2">
                    <Avatar size="xs" name="John Doe" />
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">{notification}</Text>
                </View>
            )}
            <Pressable className="flex-row items-center gap-3" onPress={onPress}>
                {isActive ? (
                    <LinearGradient
                        colors={['#6366F1', '#A855F7', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            padding: 2,
                        }}
                    >
                        <View className="flex-1 items-center border-2 border-white dark:border-neutral-900 justify-center rounded-full bg-white dark:bg-neutral-800">
                            <Text className="text-white font-medium text-2xl">{text}</Text>
                        </View>
                    </LinearGradient>
                ) : (
                    <View className="w-12 h-12 rounded-full p-0.5 bg-neutral-100 dark:bg-neutral-800">
                        <View className="flex-1 items-center border-2 border-white dark:border-neutral-900 justify-center rounded-full bg-white dark:bg-neutral-800">
                            <Text className="text-neutral-500 dark:text-neutral-400 font-medium text-2xl">{text}</Text>
                        </View>
                    </View>
                )}
                <View className="flex-1">
                    <Text className="font-medium text-base">{title}</Text>
                    <Text type="secondary" className="text-sm text-neutral-500">{type} · {time}</Text>
                </View>
                {showActions && <ChallengeActionButton onJoin={onJoin} onCancel={onCancel} title="Join" />}
            </Pressable>
        </View>
    )
}
