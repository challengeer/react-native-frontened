import { Image, View } from "react-native";
import Text from "@/components/Text";

interface AvatarProps {
    src?: string;
    name?: string;
    size?: "small" | "medium" | "large";
}

export default function Avatar({ src, name, size = "medium" }: AvatarProps) {
    const sizeClasses = {
        small: "w-12 h-12",
        medium: "w-14 h-14",
        large: "w-16 h-16"
    }[size];
    
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };
    
    return (
        <View className={`${sizeClasses} rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center`}>
            {src ? (
                <Image src={src} />
            ) : name && (
                <Text className="text-lg font-medium">{getInitials(name)}</Text>
            )}
        </View>
    )
}