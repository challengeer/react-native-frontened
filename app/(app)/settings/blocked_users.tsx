import i18n from "@/i18n";
import React, { View } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";

export default function BlockedUsers() {
    return (
        <>
            <Header
                title={i18n.t("settings.privacy.blockedUsers.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <View className="flex-1 px-4 pt-2">
            </View>
        </>
    )
}
