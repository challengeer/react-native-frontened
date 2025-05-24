import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import UsernameInput from "@/components/register/UsernameInput";
import Button from "@/components/common/Button";

export default function Username() {
    const { user, refreshUser } = useAuth();
    const [username, setUsername] = useState<string>(user?.username || "");
    const [isValidUsername, setIsValidUsername] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        if (!isValidUsername) return;

        setIsLoading(true);
        try {
            await api.put("/user/username", { username: username.trim() });

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
        <>
            <Header
                title={i18n.t("settings.account.username.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <View className="flex-1 px-4 pb-4 pt-2 justify-between">
                <UsernameInput
                    description={i18n.t("settings.account.username.description")}
                    value={username}
                    onChangeText={setUsername}
                    onValidationChange={setIsValidUsername}
                    autoFocus
                />
                <Button
                    title={i18n.t("buttons.save")}
                    size="lg"
                    disabled={!isValidUsername || isLoading}
                    loading={isLoading}
                    onPress={handleSubmit}
                />
            </View>
        </>
    );
}   