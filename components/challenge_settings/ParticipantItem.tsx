import React from "react";
import { Pressable, View } from "react-native";
import Text from "@/components/common/Text";
import Avatar from "@/components/common/Avatar"

interface ParticipantItemProps {
    index?: number;
    userId: string;
    title: string | React.ReactNode;
    subtitle: string | React.ReactNode;
    name: string;
    profilePicture?: string;
    onRemove: () => void;
}

export default function ParticipantItem({ onRemove, index, title, subtitle, name, profilePicture }: ParticipantItemProps) {
    return (
        <Pressable
            onPress={onRemove}
            className={`border-b border-neutral-100 dark:border-neutral-800 ${index === 0 ? "border-t" : ""}`}
        >
            <View className="px-4 py-3 flex-row items-center gap-3">
                <Avatar source={profilePicture} name={name} />
                <View className="flex-1">
                    {typeof title === "string" ? <Text className="leading-tight font-medium">{title}</Text> : title}
                    {typeof subtitle === "string" ? <Text type="secondary" className="text-base">{subtitle}</Text> : subtitle}
                </View>
                <View 
                    className="bg-red-50 dark:bg-red-800 px-3 py-1 rounded-full"
                >
                    <Text className="text-sm">Remove</Text>
                </View>
            </View>
        </Pressable>
    );
} 