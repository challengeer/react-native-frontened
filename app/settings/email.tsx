import { View } from "react-native";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import InputBar from "@/components/InputBar";

export default function Email() {
    return (
        <View>
            <Header title="Email" leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2">
                <InputBar label="Email" />
            </View>
        </View>
    );
}   