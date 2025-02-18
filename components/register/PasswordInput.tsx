import i18n from "@/i18n";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import InputBar from "@/components/common/InputBar";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import { Pressable } from "react-native";

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
        message: i18n.t("register.passwordDescription")
    });
    const [showPassword, setShowPassword] = useState(false);

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
            <View className="relative">
                <InputBar
                    label={i18n.t("register.passwordLabel")}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-3/4 -translate-y-3/4"> {/* It seems to be in the center but 1/2 did not work so I had to use 3/4...*/}
                    {showPassword ? <Icon icon={EyeSlashIcon} size={20} /> : <Icon icon={EyeIcon} size={20} />}
                </Pressable>
            </View>
            <View className="flex-row items-center gap-1">
                <Icon
                    icon={CheckCircleIcon}
                    size={20}
                    lightColor={validation.isValid ? "#22c55e" : "#737373"}
                    darkColor={validation.isValid ? "#22c55e" : "#a3a3a3"}
                />
                <Text type="secondary" className="text-sm">
                    {validation.message}
                </Text>
            </View>
        </View>
    );
}