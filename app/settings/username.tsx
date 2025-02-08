import { View } from "react-native";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import UsernameInput from "@/components/register/UsernameInput";

export default function Username() {
    return (
        <View>
            <Header title="Username" leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2">
                <UsernameInput />
            </View>
        </View>
    );
}   