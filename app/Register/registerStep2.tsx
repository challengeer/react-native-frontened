import { View } from "react-native";
import CustomButton from "@/components/CustomButton";
import DatePicker from "@/components/register/DatePicker";
import { useState } from "react";

interface RegisterStep2Props {
  onNext: () => void;
}

export default function RegisterStep2({ onNext }: RegisterStep2Props) {
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  return (
    <View className="flex-1 px-4">
      <DatePicker
        value={dateOfBirth}
        onChange={setDateOfBirth}
      /> {/* NOT SHOWING BUT MAYBE BECAUSE IM ON PC */}
      <View className="mt-auto mb-6">
        <CustomButton title="Continue" onPress={onNext} large />
      </View>
    </View>
  );
}