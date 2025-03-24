import { useState } from "react";
import { ScrollView, View, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useAuth } from "@/components/context/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { SvgXml } from "react-native-svg";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import StepIndicatorBar from "@/components/common/StepIndicatorBar";

const SCREEN_WIDTH = Dimensions.get("window").width;

const googleIconXml = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.55 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
`;

const onboardingData = [
    {
        image: require("@/assets/images/onboarding/images-stack.png"),
        title: "Create interactive challenges with friends",
    },
    {
        image: require("@/assets/images/onboarding/images-stack.png"),
        title: "Create interactive challenges with friends",
    },
    {
        image: require("@/assets/images/onboarding/images-stack.png"),
        title: "Create interactive challenges with friends",
    },
];

export default function AuthPage() {
    const { signInWithGoogle } = useAuth();
    const [currentPosition, setCurrentPosition] = useState(1);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / SCREEN_WIDTH);
        setCurrentPosition(index + 1);
    };

    return (
        <SafeAreaView className="flex-1">
            <Header title="Challengeer" />

            <StepIndicatorBar
                currentPosition={currentPosition}
                stepCount={onboardingData.length}
                className="px-4 py-2"
            />

            <ScrollView
                horizontal
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                pagingEnabled
            >
                {onboardingData.map((item, index) => (
                    <View key={index} style={{ width: SCREEN_WIDTH }} className="px-4 items-center justify-center gap-8">
                        <Image source={item.image} style={{ width: SCREEN_WIDTH, height: 300 }} contentFit="contain" />
                        <Text className="text-3xl font-bold text-center">{item.title}</Text>
                    </View>
                ))}
            </ScrollView>

            <View className="p-4">
                <Button
                    size="lg"
                    variant="secondary"
                    title="Sign in with Google"
                    onPress={() => signInWithGoogle()}
                    leftSection={<SvgXml xml={googleIconXml} width={24} height={24} />}
                />
            </View>
        </SafeAreaView>
    )
}