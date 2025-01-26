import { View, Text, TextInput } from "react-native";
import CustomButton from "@/components/CustomButton";
import CountryPicker from "@/components/register/CountryPicker";
import InputBar from "@/components/InputBar";
import { useState } from "react";
import { router } from "expo-router";
import RegisterHeader from "@/components/register/RegisterHeader";

export default function RegisterStep3() {
  const [selectedPrefix, setSelectedPrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  const isValidPhoneNumber = (number: string) => {
    return number.length >= 7 && number.length <= 15;
  }; /* simple verification*/

  return (
    <View className="flex-1 gap-6">
      <RegisterHeader stepCount={5} currentPosition={3} />
      <View className="flex-1 px-4">
        <Text className="text-base">Enter your phone number</Text>

        <View className="flex-row w-full gap-2">
          <CountryPicker
            selectedPrefix={selectedPrefix}
            onSelect={setSelectedPrefix}
            className="flex-2"
          />
          <InputBar value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" className="flex-1" />
        </View>

        <Text className="text-gray-500 text-sm mt-2">
          We'll send you a code to verify your phone number
        </Text>

        <View className="mt-auto mb-4">
          <CustomButton
            title="Continue"
            onPress={() => router.push("/register/step4")}
            large
            disabled={!isValidPhoneNumber(phoneNumber)}
          />
        </View>
      </View>
    </View>
  );
}