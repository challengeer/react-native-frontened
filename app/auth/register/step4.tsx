import { View } from "react-native";
import Button from "@/components/Button";
import VerificationInput from "@/components/register/VerificationInput";
import RegisterHeader from "@/components/register/RegisterHeader";
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
        <VerificationInput
          value={code}
          onChange={setCode}
        />
        <View className="mt-auto mb-4">
          <Button
            size="lg"
            title="Continue"
            onPress={() => router.push("/auth/register/step5")}
            disabled={code.length !== 6}
          />
        </View>
      </View>
    </View>
  );
}