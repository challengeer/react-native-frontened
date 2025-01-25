import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center px-4">
      <CustomButton large title="Register" onPress={() => router.push("/register")} />
    </View>
  );
}