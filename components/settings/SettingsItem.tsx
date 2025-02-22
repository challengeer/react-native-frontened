import { View, TouchableOpacity } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";

interface SettingsItemProps {
    title: React.ReactNode;
    value?: React.ReactNode;
    onPress?: () => void;
    rightSection?: React.ReactNode;
    className?: string;
    borderBottom?: boolean;
    rounded?: boolean;
    withArrow?: boolean;
}

export default function SettingsItem({ 
    title, 
    value, 
    onPress, 
    rightSection, 
    className = "", 
    borderBottom = false, 
    rounded = false, 
    withArrow = false 
}: SettingsItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`
                ${className}
                ${borderBottom ? "border-b" : ""} 
                ${rounded ? "rounded-lg" : ""}
                bg-neutral-100 dark:bg-neutral-800 
                items-center flex-row justify-between p-4 
                border-neutral-200 dark:border-neutral-700
            `.trim()}
        >
            {typeof title === 'string' ? <Text className="font-medium">{title}</Text> : title}
            <View className="flex-row items-center justify-between gap-2">
                {typeof value === 'string' ? <Text type="secondary">{value}</Text> : value}
                {rightSection}
                {withArrow && (
                    <Icon icon={ChevronRightIcon} lightColor="#737373" darkColor="#a3a3a3" />
                )}
            </View>
        </TouchableOpacity>
    )
}