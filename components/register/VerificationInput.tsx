import i18n from "@/i18n";
import { View, TextInput } from "react-native";
import { useRef, useEffect } from "react";
import Text from "@/components/common/Text";

interface VerificationInputProps {
    value: string;
    onChange: (text: string) => void;
}

export default function VerificationInput({ value, onChange }: VerificationInputProps) {
    const inputRefs = Array(6).fill(0).map(() => useRef<TextInput>(null));

    const handleChange = (text: string, index: number) => {
        if (text.length > 1) {
            // Handle paste, NOT working
            const pastedText = text.replace(/[^0-9]/g, '').slice(0, 6);
            onChange(pastedText);
            if (pastedText.length === 6) {
                inputRefs[5].current?.focus();
            }
            return;
        }

        const newValue = value.split('');
        newValue[index] = text.replace(/[^0-9]/g, '');
        const newCode = newValue.join('');
        onChange(newCode);

        // Move to next input if we typed a number
        if (text && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Move to previous input on backspace if current input is empty
        if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // Focus first input on mount
    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    return (
        <View className="gap-2">
            <Text className="text-base font-medium">{i18n.t("register.verificationCodeLabel")}</Text>
            
            <View className="flex-row gap-2">
                {Array(6).fill(0).map((_, index) => (
                    <TextInput
                        key={index}
                        ref={inputRefs[index]}
                        value={value[index] || ''}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        className="flex-1 py-6 text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xl font-medium text-center"
                        selectTextOnFocus
                    />
                ))}
            </View>

            <Text type="secondary" className="text-sm">{i18n.t("register.verificationCodeDescription")}</Text>
        </View>
    );
}