import RegisterHeader from "@/components/Register/RegisterHeader";
import { View } from "react-native";

export default function RegisterScreen() {
  return (
    <View>
      <RegisterHeader stepCount={5} currentPosition={3} />
    </View>
  );
}