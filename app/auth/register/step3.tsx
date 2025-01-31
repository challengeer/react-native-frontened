import { View } from "react-native";
import CustomButton from "@/components/CustomButton";
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
          <CustomButton
            title="Continue"
            onPress={() => router.push("/register/step4")}
            large
            // disabled={!isValidPhoneNumber(phoneNumber)}
          />
        </View>
      </View>
    </View>
  );
}