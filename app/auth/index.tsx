import Button from '@/components/common/Button';
import { router } from 'expo-router';
import { View } from 'react-native';
import GoogleButton from '@/components/auth/GoogleButton';

export default function AuthPage() {
    return (
        <View className="flex-1 justify-center px-4 gap-3">
            <GoogleButton />
            <Button size="lg" title="Register" onPress={() => router.push("/auth/register")} />
            <Button size="lg" variant="secondary" title="Log in" onPress={() => router.push("/auth/login")} />
        </View>
    )
}