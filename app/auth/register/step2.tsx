import { View } from "react-native";
import Button from "@/components/common/Button";
import DatePicker from "@/components/register/DatePicker";
import { useState } from "react";
import { router } from "expo-router";
import RegisterHeader from "@/components/register/RegisterHeader";

export default function RegisterStep2() {
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  return (
    <View className="flex-1 gap-6">
      <RegisterHeader stepCount={6} currentPosition={2} />
      <View className="flex-1 px-4">
        <DatePicker
          value={dateOfBirth}
          onChange={setDateOfBirth}
        /> {/*NOT SHOWING BUT MAYBE BECAUSE IM ON PC */}
        <View className="mt-auto mb-4">
          <Button size="lg" title="Continue" onPress={() => router.push("/auth/register/step3")} large />
        </View>
      </View>
    </View>
  );
}