import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import { InputBar } from "@/components/common/InputBar";
import Button from "@/components/common/Button";

const NAME_MAX_LENGTH = 30;

export default function Name() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState<string>(user?.display_name || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const isValidName = name.length > 0 && name.length <= NAME_MAX_LENGTH && name !== user?.display_name;

    const handleSubmit = async () => {
        if (!isValidName) return;

        setIsLoading(true);
        try {
            await api.put("/user/display-name", { display_name: name.trim() });

            // Refresh the user profile
            await refreshUser();
            await queryClient.invalidateQueries({
                queryKey: ["user", user?.user_id?.toString()]
            });

            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <Header
                title={i18n.t("settings.account.displayName.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <KeyboardAvoidingView
                behavior="padding"
                className="flex-1 px-4 justify-between"
                keyboardVerticalOffset={16}
            >
                <InputBar
                    value={name}
                    onChangeText={setName}
                    description={i18n.t("settings.account.displayName.description")}
                    maxLength={NAME_MAX_LENGTH}
                    autoFocus
                />
                <Button
                    title={i18n.t("buttons.save")}
                    size="lg"
                    disabled={!isValidName || isLoading}
                    loading={isLoading}
                    onPress={handleSubmit}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}   