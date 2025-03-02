import i18n from "@/i18n";
import React, { View } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import InputBar from "@/components/common/InputBar";
import Button from "@/components/common/Button";

export default function Email() {
    return (
        <>
            <Header
                title={i18n.t("settings.account.email.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <View className="flex-1 px-4 pb-4 justify-between">
                <InputBar
                    description={i18n.t("settings.account.email.description")}
                    autoFocus
                />
                <Button title={i18n.t("buttons.save")} size="lg" />
            </View>
        </>
    );
}   