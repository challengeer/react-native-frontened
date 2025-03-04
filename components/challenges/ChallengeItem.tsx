import { View, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; 
import Text from "@/components/common/Text";

interface ChallengesItemProps {
    title: string;
    type: string;
    text: string;
    time: string;
    rightSection?: React.ReactNode;
    onPress: () => void;
    isActive?: boolean;
    index?: number;
}

export default function ChallengeItem({ title, type, text, time, rightSection, onPress, isActive = false, index }: ChallengesItemProps) {
    return (
        <Pressable className={`gap-2 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex-row items-center ${index === 0 ? "border-t" : ""}`} onPress={onPress}>
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
                <View className="w-14 h-14 rounded-full p-0.5 bg-neutral-100 dark:bg-neutral-800">
                    <View className="flex-1 items-center border-2 border-white dark:border-neutral-900 justify-center rounded-full bg-white dark:bg-neutral-800">
                        <Text className="text-neutral-500 dark:text-neutral-400 font-medium text-2xl">{text}</Text>
                    </View>
                </View>
            )}
            <View className="flex-1">
                <Text className="font-medium">{title}</Text>
                <View className="flex-row items-center gap-2">
                    <Text type="secondary" className="text-base">{type}</Text>
                    <Text type="secondary" className="text-base"> {time}</Text>
                </View>
            </View>
            {rightSection}
        </Pressable>
    )
}
