import { View } from "react-native";
import Text from "@/components/Text";

interface CountryItemProps {
    flag: string
    name: string
    dial_code: string
}

export default function CountyItem({ flag, name, dial_code }: CountryItemProps) {
    return (
        <View className="py-4 flex-row items-center gap-4 border-b border-neutral-100 dark:border-neutral-800">
            <Text className="text-[24px] mt-2">{flag}</Text>
            <View className="flex-1 flex-row items-center justify-between gap-2">
                <Text>{name}</Text>
                <Text type="secondary">{dial_code}</Text>
            </View>
        </View>
    )
}