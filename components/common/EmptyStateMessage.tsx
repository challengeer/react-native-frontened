import React from "react";
import { View } from "react-native";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";

interface EmptyStateMessageProps {
    title: string;
    description: string;
    buttonTitle: string;
    onPress: () => void;
    buttonLeftSection?: React.ReactNode;
    buttonVariant?: "primary" | "secondary";
}

export default function EmptyStateMessage({
    title,
    description,
    buttonTitle,
    onPress,
    buttonLeftSection,
    buttonVariant = "primary",
}: EmptyStateMessageProps) {
    return (
        <View className="flex-1 items-center justify-center p-6">
            <Text className="text-center text-xl font-bold mb-2">{title}</Text>
            <Text type="secondary" className="text-center text-base mb-6">{description}</Text>
            <Button
                title={buttonTitle}
                onPress={onPress}
                leftSection={buttonLeftSection}
                variant={buttonVariant}
            />
        </View>
    );
} 