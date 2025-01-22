import { View } from "react-native";
import Text from "@/components/Text";

interface HeaderProps {
    leftSection?: React.ReactNode;
    title?: string;
    rightSection?: React.ReactNode;
}

export default function Header({ leftSection, title, rightSection }: HeaderProps) {
    return (
        <View className="relative flex-row items-center justify-between gap-2 px-4 py-4">
            <View>{leftSection}</View>
            <Text className="absolute inset-x-0 -z-10 text-center text-xl font-bold">{title}</Text>
            <View>{rightSection}</View>
        </View>
    )
}