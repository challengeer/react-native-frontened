import i18n from "@/i18n";
import api from "@/lib/api";
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/components/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import InputBar from "@/components/common/InputBar";
import Button from "@/components/common/Button";

export default function Name() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.display_name || "");
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const isValidName = name.length > 0 && name.length <= 15 && name !== user?.display_name;

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
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Header title={i18n.t("settings.profile.displayName")} leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2">
                <InputBar
                    label={i18n.t("settings.profile.displayName")}
                    value={name}
                    onChangeText={setName}
                    maxLength={15}
                    autoFocus
                />
            </View>
            <View className="px-4 py-2 absolute bottom-4 left-0 right-0">
                <Button 
                    title={i18n.t("settings.profile.save")} 
                    size="lg" 
                    disabled={!isValidName || isLoading}
                    loading={isLoading}
                    onPress={handleSubmit}
                />
            </View>
        </View>
    );
}   