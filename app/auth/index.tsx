import i18n from "@/i18n";
import { useState } from "react";
import { ScrollView, View, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import StepIndicatorBar from "@/components/common/StepIndicatorBar";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AuthPage() {
    const [currentPosition, setCurrentPosition] = useState(1);
    const insets = useSafeAreaInsets();

    const onboardingData = [
        {
            image: require("@/assets/images/onboarding/images-stack.png"),
            title: i18n.t('auth.onboarding.slides.0.title'),
        },
        {
            image: require("@/assets/images/onboarding/images-stack.png"),
            title: i18n.t('auth.onboarding.slides.1.title'),
        },
        {
            image: require("@/assets/images/onboarding/images-stack.png"),
            title: i18n.t('auth.onboarding.slides.2.title'),
        },
    ];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / SCREEN_WIDTH);
        setCurrentPosition(index + 1);
    };

    return (
        <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <Header title={i18n.t('auth.onboarding.title')} />

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
                <GoogleSignInButton />
            </View>
        </View>
    )
}