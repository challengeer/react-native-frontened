import { View } from "react-native";
import Text from "@/components/Text";

interface FriendsPageProps {
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
}

export default function FriendDisplay({ leftSection, rightSection }: FriendsPageProps) {
    return (
        <View className="flex-row py-2 items-center gap-2 border-b border-neutral-200 dark:border-neutral-700">
            <View>{leftSection}</View>
            <View className="flex-1">
                <Text className="primary">Display name</Text>
                <Text className="text-sm secondary">@Username</Text>
            </View>
            <View>{rightSection}</View>
        </View>
    );
}