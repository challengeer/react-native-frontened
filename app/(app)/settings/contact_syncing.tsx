import i18n from "@/i18n";
import React, { View } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import OptionButton from "@/components/settings/SettingsItem";

export default function ContactSyncingPage() {
    return (
        <>
            <Header
                title={i18n.t("settings.privacy.contactSyncing.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <View className="flex-1 px-4 pt-2">
                <OptionButton
                    itemIndex={0}
                    totalItems={1}
                    title="Delete all contacts"
                    onPress={() => {}}
                />
            </View>
        </>
    );
}