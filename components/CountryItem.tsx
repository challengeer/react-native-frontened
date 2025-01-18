import { View } from "react-native";
import Text from "@/components/Text";

interface CountryItemProps {
    flag: string
    name: string
    dial_code: string
}

export default function CountyItem({ flag, name, dial_code }: CountryItemProps) {
    return (
        <View className="py-4 flex-row items-center gap-4 border-b border-neutral-200 dark:border-neutral-700">
            <Text className="text-2xl">{flag}</Text>
            <View className="flex-row gap-2">
                <Text type="secondary">{dial_code}</Text>
                <Text>{name}</Text>
            </View>
        </View>
    )
}