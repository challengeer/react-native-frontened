import { View } from "react-native";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import InputBar from "@/components/InputBar";

export default function Mobile() {
    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Header title="Mobile number" leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2">
                <InputBar label="Mobile number" keyboardType="number-pad" />
            </View>
        </View>
    );
}   