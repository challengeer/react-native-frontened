import { View } from "react-native";
import { Link } from "expo-router";
import Text from "@/components/Text";
import Avatar from "@/components/Avatar";

interface UserItemProps {
    userId: string;
    displayName: string;
    username: string;
    profilePicture?: string;
    rightSection?: React.ReactNode;
}

export default function UserItem({ userId, displayName, username, profilePicture, rightSection }: UserItemProps) {
    return (
        <Link href={`/user/${userId}`} className="px-4">
            <View className="py-3 flex-row items-center gap-2 border-b border-neutral-100 dark:border-neutral-800">
                <Avatar source={profilePicture} name={displayName} />
                <View className="flex-1">
                    <Text className="leading-tight font-medium">{displayName}</Text>
                    <Text type="secondary" className="text-base">@{username}</Text>
                </View>
                {rightSection}
            </View>
        </Link>
    );
}