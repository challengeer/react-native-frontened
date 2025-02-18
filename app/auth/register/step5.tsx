import { View } from "react-native";
import Button from "@/components/common/Button";
import { router } from "expo-router";
import RegisterHeader from "@/components/register/RegisterHeader";
import UsernameInput from "@/components/register/UsernameInput";


export default function RegisterStep5() {
  return (
    <View className="flex-1 gap-6">
      <RegisterHeader stepCount={6} currentPosition={5} />
      <View className="flex-1 px-4">
        <UsernameInput />
        <View className="mt-auto mb-4">
          <Button size="lg" title="Continue" onPress={() => router.push("/auth/register/step6")} />
        </View>
      </View>
    </View>
  );
}