import { View, Pressable } from "react-native";
import { Link } from "expo-router";
import Text from "@/components/common/Text";
import Avatar from "@/components/common/Avatar";

interface UserItemProps {
    index?: number;
    userId?: string;
    title: string | React.ReactNode;
    subtitle: string | React.ReactNode;
    name: string;
    profilePicture?: string;
    rightSection?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
}

export default function UserItem({
    index,
    userId,
    title,
    subtitle,
    name,
    profilePicture,
    rightSection,
    onPress,
    disabled
}: UserItemProps) {
    const content = (
        <View className={`px-4 py-3 flex-row items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}>
            <Avatar source={profilePicture} name={name} />
            <View className="flex-1">
                {typeof title === "string" ? <Text numberOfLines={1} ellipsizeMode="tail" className="leading-tight font-medium">{title}</Text> : title}
                {typeof subtitle === "string" ? <Text type="secondary" numberOfLines={1} ellipsizeMode="tail" className="text-base">{subtitle}</Text> : subtitle}
            </View>
            {rightSection}
        </View>
    );

    if (disabled || onPress) {
        return (
            <Pressable
                onPress={!disabled ? onPress : undefined}
                disabled={disabled}
            >
                {content}
            </Pressable>
        );
    }

    if (userId) {
        return (
            <Link href={`/user/${userId}`}>
                {content}
            </Link>
        );
    }

    return content;
}