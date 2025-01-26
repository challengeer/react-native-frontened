import i18n from "@/i18n";
import { View } from "react-native";
import InputBar from "@/components/InputBar";
import CustomButton from "@/components/CustomButton";
import Text from "@/components/Text";
import { router } from "expo-router";
import Icon from "@/components/Icon";
import { CheckCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from "react-native-heroicons/outline";
import RegisterHeader from "@/components/register/RegisterHeader";
import UsernameInput from "@/components/register/UsernameInput";


export default function RegisterStep5() {
  return (
    <View className="flex-1 gap-6">
      <RegisterHeader stepCount={6} currentPosition={5} />
      <View className="flex-1 px-4">
        <UsernameInput />
        <View className="mt-auto mb-4">
          <CustomButton large title="Continue" onPress={() => router.push("/register/step6")} />
        </View>
      </View>
    </View>
  );
}