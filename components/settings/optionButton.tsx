import { View } from "react-native";
import Text from "@/components/Text";

interface OptionButtonProps {
    title: string;
    value: string;
    onPress: () => void;
    rightSection?: React.ReactNode;
    className?: string;
}

export default function OptionButton({ title, value, onPress, rightSection, className }: OptionButtonProps) {
    return (
        <View className={`bg-neutral-100 dark:bg-neutral-800 items-center flex-row justify-between p-5 border-b border-neutral-200 dark:border-neutral-700 ${className}`}>
            <Text>{title}</Text>
            <View className="flex-row items-center justify-between gap-2">
                <Text>{value}</Text>
                {rightSection}
            </View>
        </View>
    )
}