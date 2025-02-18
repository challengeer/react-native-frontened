import i18n from "@/i18n";
import { useState } from "react";
import { View } from "react-native";
import Text from "@/components/common/Text";
import InputBar from "@/components/common/InputBar";
import CountryPicker from "@/components/register/CountryPicker";

export default function PhoneInput() {
    const [selectedPrefix, setSelectedPrefix] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');

    const isValidPhoneNumber = (number: string) => {
        return number.length >= 7 && number.length <= 15;
    }; /* simple verification*/

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