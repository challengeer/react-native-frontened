import { View, Text } from "react-native";
import InputBar from "@/components/InputBar";
import { CheckCircleIcon, ExclamationCircleIcon } from "react-native-heroicons/outline";
import { useState, useEffect } from "react";
import i18n from "@/i18n";

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
        <View>
            <InputBar
                label="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
            />
            <View className="flex-row items-center mt-2 gap-1">
                {validation.isValid ? (
                    <CheckCircleIcon size={16} color="#16a34a" />
                ) : (
                    <ExclamationCircleIcon size={16} color="#dc2626" />
                )}
                <Text
                    className={`text-sm ${validation.isValid ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {validation.message}
                </Text>
            </View>
        </View>
    );
}