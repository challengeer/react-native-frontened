import i18n from "@/i18n";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import PasswordInput from "@/components/register/PasswordInput";
import Button from "@/components/common/Button";

export default function Password() {
    const [password, setPassword] = useState("");

    return (
        <SafeAreaView className="flex-1">
            <Header title={i18n.t("settings.account.password.header")} leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />

            <View className="flex-1 px-4 pb-4 justify-between">
                <PasswordInput
                    value={password}
                    onChange={setPassword}
                />
                <Button title={i18n.t("buttons.save")} size="lg" />
            </View>
        </SafeAreaView>
    );
}   