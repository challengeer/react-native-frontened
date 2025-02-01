import { View } from "react-native";
import i18n from "@/i18n";
import CustomButton from "@/components/CustomButton";
import VerificationInput from "@/components/register/VerificationInput";
import RegisterHeader from "@/components/register/RegisterHeader";
import Text from "@/components/Text";
import { router } from "expo-router";
import { useState } from "react";

interface RegisterStep4Props {
  phoneNumber?: string; // Phone number for description
}

export default function RegisterStep4({ phoneNumber }: RegisterStep4Props) {
  const [code, setCode] = useState('');

  return (
    <View className="flex-1 gap-6">
      <RegisterHeader stepCount={6} currentPosition={4} />
      <View className="flex-1 px-4">
        <Text className="text-base font-medium">{i18n.t("register.verificationCodeLabel")}</Text>
        <VerificationInput
          value={code}
          onChange={setCode}
        />
        <Text className="text-gray-500 text-sm">
          {i18n.t("register.verificationCodeDescription")} {phoneNumber}
        </Text>
        <View className="mt-auto mb-4">
          <CustomButton
            title="Continue"
            onPress={() => router.push("/auth/register/step5")}
            large
            disabled={code.length !== 6}
          />
        </View>
      </View>
    </View>
  );
}