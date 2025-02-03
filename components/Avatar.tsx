import { Image, View } from "react-native";
import Text from "@/components/Text";

interface AvatarProps {
    src?: string;
    name?: string;
    size?: "sm" | "md" | "lg";
}

const colors = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-yellow-400", "bg-lime-400", "bg-green-400", "bg-emerald-400", "bg-teal-400", "bg-cyan-400", "bg-sky-400", "bg-blue-400", "bg-indigo-400", "bg-violet-400", "bg-purple-400", "bg-fuchsia-400", "bg-pink-400", "bg-rose-400", "bg-slate-400", "bg-gray-400", "bg-stone-400"];

export default function Avatar({ src, name, size = "md" }: AvatarProps) {
    const sizeClasses = {
        sm: "w-12 h-12",
        md: "w-14 h-14",
        lg: "w-16 h-16"
    }[size];
    
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    function colorFromText(text: string) {
        let charSum = 0;
        for (let i = 0; i < text.length; i++) {
            charSum += text.charCodeAt(i);
        }
        return colors[charSum % colors.length];
    }
    
    return (
        <View className={`${sizeClasses} ${name && colorFromText(name)} rounded-full items-center justify-center`}>
            {src ? (
                <Image src={src} />
            ) : name && (
                <Text className="text-lg text-white font-medium">{getInitials(name)}</Text>
            )}
        </View>
    )
}