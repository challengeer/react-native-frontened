import { View } from "react-native";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import InputBar from "@/components/InputBar";
import i18n from "@/i18n";
import Button from "@/components/Button";

export default function Mobile() {
    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Header title={i18n.t("settings.profile.mobileNumber")} leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2">
                <InputBar label={i18n.t("settings.profile.mobileNumber")} keyboardType="number-pad" />
            </View>
            <View className="px-4 py-2 absolute bottom-4 left-0 right-0"> 
                <Button title={i18n.t("settings.profile.save")} size="lg" />
            </View>
        </View>
    );
}   