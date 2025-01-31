import i18n from "@/i18n";
import { View } from "react-native";
import InputBar from "@/components/InputBar";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import RegisterHeader from "@/components/register/RegisterHeader";
import { useState } from "react";

export default function RegisterStep1() {
    const [name, setName] = useState<string>("");

    return (
        <View className="flex-1 gap-6">
            <RegisterHeader stepCount={6} currentPosition={1} />
            <View className="flex-1 px-4">
                <InputBar
                    value={name}
                    onChangeText={setName}
                    label={i18n.t("register.nameLabel")}
                    description={i18n.t("register.legalText")}
                    keyboardType="default"
                    autoFocus
                />
                <View className="mt-auto mb-4">
                    <CustomButton
                        large
                        title="Continue"
                        onPress={() => router.push("/register/step2")}
                        disabled={name.length < 3}
                    />
                </View>
            </View>
        </View>
    );
}