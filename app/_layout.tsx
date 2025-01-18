import "../global.css";

import { Slot } from "expo-router";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import Text from "@/components/Text";

export default function Root() {
    const { toggleColorScheme } = useColorScheme();

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Text onPress={toggleColorScheme}>Toogle theme</Text>
            <Slot />
        </View>
    )
};