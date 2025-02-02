import { View } from "react-native";
import Text from "@/components/Text";

interface FriendsPageProps {
    displayName?: string;
    username?: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
}

export default function FriendDisplay({ displayName, username, leftSection, rightSection }: FriendsPageProps) {
    return (
        <View className="flex-row py-2 items-center gap-2 border-b border-neutral-200 dark:border-neutral-700">
            <View>{leftSection}</View>
            <View className="flex-1">
                <Text>{displayName}</Text>
                <Text type="secondary" className="text-sm">@{username}</Text>
            </View>
            <View>{rightSection}</View>
        </View>
    );
}