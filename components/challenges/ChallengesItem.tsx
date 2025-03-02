import { View, Pressable } from "react-native";
import Text from "@/components/common/Text";
import { Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; /* install expo-linear-gradient and build again */

interface ChallengesItemProps {
    title: string;
    type: string;
    image: string;
    time: string;
    rightSection?: React.ReactNode;
    onPress: () => void;
    isActive?: boolean;
}

export default function ChallengesItem({ title, type, image, time, rightSection, onPress, isActive = false }: ChallengesItemProps) {
    return (
        <Pressable className="gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex-row items-center" onPress={onPress}>
            <View className="w-14 h-14">
                {isActive ? (
                    <LinearGradient
                        colors={['#6366F1', '#A855F7', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-14 h-14 rounded-full"
                    /> /* this should work, needs testing*/
                ) : (
                    <Image source={{ uri: image }} className="w-full h-full rounded-full" />
                )}
            </View>
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
