import { useState } from "react";
import { View } from "react-native";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import PasswordInput from "@/components/register/PasswordInput";

export default function Password() {
    const [password, setPassword] = useState("");
    return (
        <View>
            <Header title="Password" leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2">
                <PasswordInput value={password} onChange={setPassword} />
            </View>
        </View>
    );
}   