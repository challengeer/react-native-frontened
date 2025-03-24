import i18n from "@/i18n";
import { useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { InputBar } from "@/components/common/InputBar";
import { useQuery } from "@tanstack/react-query";
import { Challenge } from "@/types/Challenge";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";

export default function Name() {
    const { challenge_id } = useLocalSearchParams();

    const { data: challenge } = useQuery<Challenge>({
        queryKey: ['challenge', challenge_id],
    });

    const initialName = challenge?.title ?? "";
    const [name, setName] = useState(initialName);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
                behavior="padding"
                className="flex-1"
            >
                <Header
                    title={i18n.t("challenge_settings.name.header")}
                    leftSection={
                        <IconCircle
                            icon={ArrowLeftIcon}
                            onPress={() => router.back()}
                        />
                    }
                />

                <View className="flex-1 px-4 pb-4 justify-between">
                    <InputBar
                        value={name}
                        onChangeText={setName}
                        description={i18n.t("challenge_settings.name.description")}
                        autoFocus
                    />
                    <Button
                        title={i18n.t("buttons.save")}
                        size="lg"
                        disabled={name === initialName || isLoading}
                        loading={isLoading}
                        onPress={handleSubmit}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
