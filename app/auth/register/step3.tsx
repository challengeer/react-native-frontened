import { View } from "react-native";
import Button from "@/components/common/Button";
import { router } from "expo-router";
import RegisterHeader from "@/components/register/RegisterHeader";
import PhoneInput from "@/components/register/PhoneInput";

export default function RegisterStep3() {
  return (
    <View className="flex-1 gap-6">
      <RegisterHeader stepCount={6} currentPosition={3} />
      <View className="flex-1 px-4">
        <PhoneInput />

        <View className="mt-auto mb-4">
          <Button
            size="lg"
            title="Continue"
            onPress={() => router.push("/auth/register/step4")}
            // disabled={!isValidPhoneNumber(phoneNumber)}
          />
        </View>
      </View>
    </View>
  );
}