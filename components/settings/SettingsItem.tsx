import { View, Pressable } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";

interface SettingsItemProps {
    itemIndex: number;
    totalItems: number;
    title: string | React.ReactNode;
    rightSection?: React.ReactNode;
    className?: string;
    showArrow?: boolean;
    onPress?: () => void;
}

export default function SettingsItem({
    itemIndex,
    totalItems,
    title,
    rightSection,
    className = "",
    showArrow = false,
    onPress,
}: SettingsItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`
                ${className}
                ${itemIndex === 0 ? "rounded-t-lg" : ""}
                ${itemIndex === totalItems - 1 ? "rounded-b-lg border-b-0" : "border-b"}
                bg-neutral-100 dark:bg-neutral-800
                items-center flex-row justify-between p-4
                border-neutral-200 dark:border-neutral-700
            `.trim()}
        >
            {typeof title === "string" ? <Text className="font-medium">{title}</Text> : title}
            <View className="flex-row items-center gap-2">
                {typeof rightSection === "string" ? <Text type="secondary" className="text-base">{rightSection}</Text> : rightSection}
                {showArrow && (
                    <Icon icon={ChevronRightIcon} lightColor="#737373" darkColor="#a3a3a3" />
                )}
            </View>
        </Pressable>
    )
}