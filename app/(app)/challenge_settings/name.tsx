import i18n from "@/i18n";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { InputBar } from "@/components/common/InputBar";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";

export default function Name() {
    const [name, setName] = useState("");
    const [isValidName, setIsValidName] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
    }

    return (
        <SafeAreaView className="flex-1">
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
                    disabled={!isValidName || isLoading}
                    loading={isLoading}
                    onPress={handleSubmit}
                />
            </View>
        </SafeAreaView>
    )
}
