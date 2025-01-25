import i18n from "@/i18n";
import { View } from "react-native";
import InputBar from "@/components/InputBar";
import CustomButton from "@/components/CustomButton";

interface RegisterStep1Props {
  onNext: () => void;
}

export default function RegisterStep1({ onNext }: RegisterStep1Props) {
  return (
    <View className="flex-1 px-4">
      <InputBar 
        label={i18n.t("register.nameLabel")} 
        description={i18n.t("register.legalText")} 
      />
      <View className="mt-auto mb-6">
        <CustomButton title="Continue" onPress={onNext} />
      </View>
    </View>
  );
}