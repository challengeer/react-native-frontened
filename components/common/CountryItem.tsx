import { Pressable, PressableProps, View } from "react-native";
import Text from "@/components/common/Text";

interface CountryItemProps extends PressableProps {
    flag: string
    name: string
    dial_code: string
}

export default function CountyItem({ flag, name, dial_code, ...props }: CountryItemProps) {
    return (
        <Pressable className="py-4 flex-row items-center gap-4 border-b border-neutral-100 dark:border-neutral-800" {...props}>
            <Text className="text-2xl">{flag}</Text>
            <View className="flex-1 flex-row items-center gap-2">
                <Text numberOfLines={1} ellipsizeMode="tail" className="flex-1">{name}</Text>
                <Text type="secondary">{dial_code}</Text>
            </View>
        </Pressable>
    )
}