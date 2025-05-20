import { View, ViewProps } from "react-native";
import Text from "@/components/common/Text";

export interface HeaderProps extends ViewProps {
    leftSection?: React.ReactNode;
    title?: string;
    rightSection?: React.ReactNode;
    className?: string;
}

export default function Header({ leftSection, title, rightSection, className = "", ...props }: HeaderProps) {
    return (
        <View className={`relative flex-row items-center justify-between gap-2 px-4 h-16 ${className}`} {...props}>
            <Text className="absolute inset-x-0 text-center text-xl font-bold">{title}</Text>
            <View>{leftSection}</View>
            <View>{rightSection}</View>
        </View>
    )
}