import { View } from "react-native";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import UsernameInput from "@/components/register/UsernameInput";
import Button from "@/components/common/Button";
import i18n from "@/i18n";

export default function Username() {
    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Header title={i18n.t("settings.profile.username")} leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2">
                <UsernameInput />
            </View>
            <View className="px-4 py-2 absolute bottom-4 left-0 right-0">
                <Button title={i18n.t("settings.profile.save")} size="lg" />
            </View>
        </View>
    );
}   