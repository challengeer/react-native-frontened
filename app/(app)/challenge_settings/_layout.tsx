import { Slot } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
            <Slot />
        </KeyboardAvoidingView>
    )
}