import i18n from "@/i18n";
import { View } from "react-native";
import Text from "@/components/common/Text";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

interface VerificationInputProps {
    cellCount?: number;
    value: string;
    onChange: (text: string) => void;
    onComplete: () => void;
    phoneNumber: string;
}

export default function VerificationInput({ cellCount = 6, value, onChange, onComplete, phoneNumber }: VerificationInputProps) {
    const ref = useBlurOnFulfill({ value, cellCount });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue: onChange,
    });

    const handleChange = (text: string) => {
        onChange(text);
        if (text.length === cellCount) {
            onComplete();
        }
    };

    return (
        <View className="gap-2">
            <Text className="text-base font-medium">{i18n.t("register.verificationCodeLabel")}</Text>
            
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={handleChange}
                cellCount={cellCount}
                rootStyle={{ gap: 8 }}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <View
                        key={index}
                        className="flex-1 h-16 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800"
                        onLayout={getCellOnLayoutHandler(index)}
                    >
                        <Text className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    </View>
                )}
            />

            <Text type="secondary" className="text-sm">{i18n.t("register.verificationCodeDescription", { phone_number: phoneNumber })}</Text>
        </View>
    );
}