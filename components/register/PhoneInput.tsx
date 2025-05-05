import i18n from "@/i18n";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { InputBar } from "@/components/common/InputBar";
import Text from "@/components/common/Text";
import CountryPicker from "@/components/register/CountryPicker";

interface PhoneInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
}

export default function PhoneInput({ value, onChangeText }: PhoneInputProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedPrefix, setSelectedPrefix] = useState('+1');

    useEffect(() => {
        onChangeText?.(selectedPrefix + phoneNumber);
    }, [selectedPrefix, phoneNumber]);

    return (
        <View className="gap-2">
            <Text className="text-base font-medium">{i18n.t("register.phoneNumberLabel")}</Text>

            <View className="flex-row w-full gap-2 items-center">
                <CountryPicker
                    selectedPrefix={selectedPrefix}
                    onSelect={setSelectedPrefix}
                    className="w-1/4"
                />
                <InputBar
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    className="flex-1"
                    autoFocus
                />
            </View>

            <Text type="secondary" className="text-sm">
                {i18n.t("register.phoneNumberDescription")}
            </Text>
        </View>
    )
}