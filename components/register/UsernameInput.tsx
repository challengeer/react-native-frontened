import i18n from "@/i18n";
import api from "@/lib/api";
import { useCallback, useState } from "react";
import { CheckIcon, XMarkIcon } from "react-native-heroicons/outline";
import { View, TextInputProps, ActivityIndicator } from "react-native";
import { debounce } from "lodash";
import InputBar from "@/components/common/InputBar";
import Icon from "@/components/common/Icon";

const USERNAME_MAX_LENGTH = 15;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MIN_LENGTH = 1;

interface UsernameInputProps extends TextInputProps {
    onValidationChange?: (isValid: boolean) => void;
}

export default function UsernameInput({ value, onChangeText, onValidationChange, ...props }: UsernameInputProps) {
    const [usernameState, setUsernameState] = useState<"available" | "taken" | "checking" | "invalid" | undefined>();

    const checkUsername = useCallback(
        debounce(async (username: string) => {
            if (!username || username.length < USERNAME_MIN_LENGTH) {
                setUsernameState(undefined);
                onValidationChange?.(false);
                return;
            }

            if (!USERNAME_REGEX.test(username)) {
                setUsernameState("invalid");
                onValidationChange?.(false);
                return;
            }

            if (username.length > USERNAME_MAX_LENGTH) {
                setUsernameState("invalid");
                onValidationChange?.(false);
                return;
            }

            setUsernameState("checking");
            try {
                const response = await api.get(`/auth/check-username?username=${username}`);
                setUsernameState(response.data.exists ? "taken" : "available");
                onValidationChange?.(response.data.exists ? false : true);
            } catch (error) {
                setUsernameState(undefined);
                onValidationChange?.(false);
            }
        }, 500),
        []
    );

    const handleChangeText = (text: string) => {
        const sanitizedText = text.trim();
        if (text === sanitizedText) {
            onValidationChange?.(false);
            checkUsername(sanitizedText);
        }
        onChangeText?.(sanitizedText);
    };

    const getStatusIcon = () => {
        switch (usernameState) {
            case "available":
                return <Icon icon={CheckIcon} lightColor="#22c55e" darkColor="#22c55e" />;
            case "taken":
                return <Icon icon={XMarkIcon} lightColor="#ef4444" darkColor="#ef4444" />;
            case "invalid":
                return <Icon icon={XMarkIcon} lightColor="#ef4444" darkColor="#ef4444" />;
            case "checking":
                return <ActivityIndicator size="small" color="#a855f7" />;
            default:
                return null;
        }
    };

    return (
        <View className="relative">
            <InputBar
                description={i18n.t("settings.username.description")}
                keyboardType="default"
                value={value}
                onChangeText={handleChangeText}
                maxLength={USERNAME_MAX_LENGTH}
                {...props}
            />
            <View className="absolute right-4 top-4">
                {getStatusIcon()}
            </View>
        </View>
    );
}