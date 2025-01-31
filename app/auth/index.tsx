import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function AuthPage() {
    return (
        <View className="flex-1 justify-center px-4 gap-3">
            <CustomButton large title="Register" onPress={() => router.push("/auth/register")} />
            <CustomButton large secondary title="Log in" onPress={() => router.push("/auth/login")} />
        </View>
    )
}