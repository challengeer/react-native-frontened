import api from "@/lib/api";
import { useCallback, useState } from "react";
import { CheckIcon, XMarkIcon } from "react-native-heroicons/outline";
import { View, ActivityIndicator } from "react-native";
import { debounce } from "lodash";
import { InputBar, InputBarProps } from "@/components/common/InputBar";
import Icon from "@/components/common/Icon";

const USERNAME_MAX_LENGTH = 15;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MIN_LENGTH = 1;

interface UsernameInputProps extends InputBarProps {
    onValidationChange?: (isValid: boolean) => void;
}

export default function UsernameInput({ value, onChangeText, onValidationChange, ...props }: UsernameInputProps) {
    const [usernameState, setUsernameState] = useState<"invalid" | "correct" | "verifying">("correct");

    const checkUsername = useCallback(
        debounce(async (username: string) => {
            if (!username || username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH || !USERNAME_REGEX.test(username)) {
                setUsernameState("invalid");
                onValidationChange?.(false);
                return;
            }

            setUsernameState("verifying");
            try {
                const response = await api.get(`/auth/check-username?username=${username}`);
                setUsernameState(response.data.exists ? "invalid" : "correct");
                onValidationChange?.(response.data.exists ? false : true);
            } catch (error) {
                setUsernameState("invalid");
                onValidationChange?.(false);
            }
        }, 500),
        []
    );

    const handleChangeText = (text: string) => {
        const sanitizedText = text.trim();
        onChangeText?.(sanitizedText);
        onValidationChange?.(false);
        checkUsername(sanitizedText);
    };

    const getStatusIcon = () => {
        switch (usernameState) {
            case "correct":
                return <Icon icon={CheckIcon} lightColor="#22c55e" darkColor="#22c55e" />;
            case "invalid":
                return <Icon icon={XMarkIcon} lightColor="#ef4444" darkColor="#ef4444" />;
            case "verifying":
                return <ActivityIndicator size="small" color="#a855f7" />;
            default:
                return null;
        }
    };

    return (
        <View className="relative">
            <InputBar
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="off"
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