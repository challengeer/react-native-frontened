import { View } from "react-native";
import { Image } from "expo-image";
import Text from "@/components/common/Text";

interface AvatarProps {
    source?: string;
    name: string;
    size?: "xs" | "sm" | "md" | "lg";
}

const colors = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-yellow-400", "bg-lime-400", "bg-green-400", "bg-emerald-400", "bg-teal-400", "bg-cyan-400", "bg-sky-400", "bg-blue-400", "bg-indigo-400", "bg-violet-400", "bg-purple-400", "bg-fuchsia-400", "bg-pink-400", "bg-rose-400", "bg-slate-400", "bg-gray-400", "bg-stone-400"];

export default function Avatar({ source, name = "User", size = "md" }: AvatarProps) {
    const sizeClasses = {
        xs: {
            container: "w-10 h-10",
            text: "text-base",
        },
        sm: {
            container: "w-12 h-12",
            text: "text-xl",
        },
        md: {
            container: "w-14 h-14",
            text: "text-2xl",
        },
        lg: {
            container: "w-32 h-32",
            text: "text-5xl",
        }
    }[size];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const colorFromText = (text: string) => {
        let charSum = 0;
        for (let i = 0; i < text.length; i++) {
            charSum += text.charCodeAt(i);
        }
        return colors[charSum % colors.length];
    }

    if (source) {
        return (
            <View className={`${sizeClasses.container} rounded-full overflow-hidden`}>
                <View className="bg-neutral-100 dark:bg-neutral-800 absolute inset-0"></View>
                <Image
                    style={{ width: "100%", height: "100%", borderRadius: 9999 }}
                    contentFit="cover"
                    source={{ uri: source }}
                />
            </View>
        )
    }

    return (
        <View className={`${sizeClasses.container} ${colorFromText(name)} rounded-full items-center justify-center`}>
            <Text className={`${sizeClasses.text} leading-normal text-white font-medium`}>{getInitials(name)}</Text>
        </View>
    )
}