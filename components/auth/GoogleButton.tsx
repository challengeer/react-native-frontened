import { Button } from "react-native";
import { router } from "expo-router";
import api from "@/lib/api";
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import * as SecureStore from "expo-secure-store";

// Configure GoogleSignin
GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // Add these if needed:
    // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export default function GoogleButton() {
    const handleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;

            if (!idToken) {
                throw new Error('No ID token received');
            }

            const result = await api.post("/auth/google", { token: idToken });

            if (result.status !== 200) {
                throw new Error(result.data.detail || "Authentication failed");
            }

            console.log(`access_token: ${result.data.access_token}`);
            console.log(`refresh_token: ${result.data.refresh_token}`);

            // Store tokens securely
            await SecureStore.setItemAsync("access_token", result.data.access_token);
            await SecureStore.setItemAsync("refresh_token", result.data.refresh_token);

            router.replace("/");
        } catch (error: any) {
            console.error("Authentication error:", error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the sign-in flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Sign-in operation already in progress
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // Play services not available
            } else {
                // Other error
            }
        }
    };

    return (
        <Button
            title="Sign in with Google"
            onPress={handleSignIn}
        />
    );
}