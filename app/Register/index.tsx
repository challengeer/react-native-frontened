import RegisterHeader from "@/components/register/RegisterHeader";
import { View } from "react-native";

export default function RegisterScreen() {
  return (
    <View>
      <RegisterHeader stepCount={5} currentPosition={3} />
    </View>
  );
}