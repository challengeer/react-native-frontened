import Button from '@/components/common/Button';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '@/components/context/AuthProvider';

export default function AuthPage() {
    const { signInWithGoogle } = useAuth();

    return (
        <SafeAreaView className="flex-1 justify-center px-4 gap-3">
            <Button size="lg" variant="secondary" title="Sign in with Google" onPress={() => signInWithGoogle()} />
            <Button size="lg" title="Register" onPress={() => router.push("/auth/register")} />
            <Button size="lg" variant="secondary" title="Log in" onPress={() => router.push("/auth/login")} />
        </SafeAreaView>
    )
}