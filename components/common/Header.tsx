import { View } from "react-native";
import Text from "@/components/common/Text";

interface HeaderProps {
    leftSection?: React.ReactNode;
    title?: string;
    rightSection?: React.ReactNode;
}

export default function Header({ leftSection, title, rightSection }: HeaderProps) {
    return (
        <View className="relative flex-row items-center justify-between gap-2 px-4 h-20">
            <Text className="absolute inset-x-0 text-center text-xl font-bold">{title}</Text>
            <View>{leftSection}</View>
            <View>{rightSection}</View>
        </View>
    )
}