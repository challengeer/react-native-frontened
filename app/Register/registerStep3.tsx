import { View, Text, TextInput } from "react-native";
import CustomButton from "@/components/CustomButton";
import CountryPicker from "@/components/register/CountryPicker";
import InputBar from "@/components/InputBar";
import { useState } from "react";

interface RegisterStep3Props {
  onNext: () => void;
}

export default function RegisterStep3({ onNext }: RegisterStep3Props) {
  const [selectedPrefix, setSelectedPrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  const isValidPhoneNumber = (number: string) => {
    return number.length >= 7 && number.length <= 15;
  }; /* simple verification*/

  return (

    <View className="flex-1 px-4 pt-4">
      <Text className="text-base">Enter your phone number</Text>

      <View className="flex-row w-full">
        <CountryPicker
          selectedPrefix={selectedPrefix}
          onSelect={setSelectedPrefix}
        />
        <InputBar value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" className="flex-1" />
      </View>

      <Text className="text-gray-500 text-sm mt-2">
        We'll send you a code to verify your phone number
      </Text>

      <View className="mt-auto mb-6">
        <CustomButton
          title="Continue"
          onPress={onNext}
          large
          disabled={!isValidPhoneNumber(phoneNumber)}
        />
      </View>
    </View>
  );
}