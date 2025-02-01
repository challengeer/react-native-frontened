import i18n from "@/i18n";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import InputBar from "@/components/InputBar";
import Text from "@/components/Text";
import Icon from "@/components/Icon";

interface PasswordValidation {
    isValid: boolean;
    message: string;
}

interface PasswordInputProps {
    value: string;
    onChange: (text: string) => void;
    onValidationChange?: (isValid: boolean) => void;
}

export default function PasswordInput({ value, onChange, onValidationChange }: PasswordInputProps) {
    const [validation, setValidation] = useState<PasswordValidation>({
        isValid: false,
        message: "Password must be at least 8 characters"
    });

    useEffect(() => {
        const isValid = value.length >= 8;
        setValidation({
            isValid,
            message: isValid
                ? i18n.t("register.passwordValid")
                : i18n.t("register.passwordDescription")
        });
        onValidationChange?.(isValid);
    }, [value]);

    return (
        <View className="gap-2">
            <InputBar
                label="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoFocus
            />
            <View className="flex-row items-center gap-1">
                <Icon
                    icon={CheckCircleIcon}
                    size={16}
                    lightColor={validation.isValid ? "#16a34a" : "#737373"}
                    darkColor={validation.isValid ? "#16a34a" : "#a3a3a3"}
                />
                <Text type="secondary" className="text-sm">
                    {validation.message}
                </Text>
            </View>
        </View>
    );
}