import { View } from "react-native";
import { Link } from "expo-router";
import Text from "@/components/common/Text";
import Avatar from "@/components/common/Avatar";

interface UserItemProps {
    index?: number;
    userId: string;
    title: string | React.ReactNode;
    subtitle: string | React.ReactNode;
    name: string;
    profilePicture?: string;
    rightSection?: React.ReactNode;
}

export default function UserItem({ index, userId, title, subtitle, name, profilePicture, rightSection }: UserItemProps) {
    return (
        <Link href={`/user/${userId}`} className={`border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}>
            <View className="px-4 py-3 flex-row items-center gap-3">
                <Avatar source={profilePicture} name={name} />
                <View className="flex-1">
                    {typeof title === "string" ? <Text className="leading-tight font-medium">{title}</Text> : title}
                    {typeof subtitle === "string" ? <Text type="secondary" className="text-base">{subtitle}</Text> : subtitle}
                </View>
                {rightSection}
            </View>
        </Link>
    );
}