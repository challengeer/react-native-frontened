import { View } from "react-native";
import { Link } from "expo-router";
import Text from "@/components/common/Text";
import Avatar from "@/components/common/Avatar";

interface UserItemProps {
    index?: number;
    userId: string;
    displayName: string;
    username: string;
    profilePicture?: string;
    rightSection?: React.ReactNode;
}

export default function UserItem({ index, userId, displayName, username, profilePicture, rightSection }: UserItemProps) {
    return (
        <Link href={`/user/${userId}`} className={`border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}>
            <View className="px-4 py-3 flex-row items-center gap-2">
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