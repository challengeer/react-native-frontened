import React, { useEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import { router, Slot, useNavigation, Stack, useLocalSearchParams } from "expo-router";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Constants moved outside component
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;
const CLOSE_THRESHOLD = SCREEN_HEIGHT / 4;
const ANIMATION_CONFIG = { duration: 200 };

export default function SubmissionLayout() {
    const { x = "0", y = "0" } = useLocalSearchParams<{ x: string; y: string }>();
    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        // Initial position (where the click happened)
        if (x && y) {
            translateX.value = parseFloat(x) - CENTER_X;
            translateY.value = parseFloat(y) - CENTER_Y;
        }

        // Animate to center
        translateX.value = withTiming(0, ANIMATION_CONFIG);
        translateY.value = withTiming(0, ANIMATION_CONFIG);
        scale.value = withTiming(1, ANIMATION_CONFIG);

        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            scale.value = withTiming(0, ANIMATION_CONFIG);
            // Animate back to original position
            translateX.value = withTiming(x ? parseFloat(x) - CENTER_X : 0, ANIMATION_CONFIG);
            translateY.value = withTiming(y ? parseFloat(y) - CENTER_Y : 0, ANIMATION_CONFIG);
        });

        return unsubscribe;
    }, [navigation, x, y]);

    const closeScreen = () => {
        router.back();
    };

    // Memoized gesture handler
    const panGesture = useMemo(
        () =>
            Gesture.Pan()
                .minDistance(10)
                .onChange((event) => {
                    if (event.translationY > 0) {
                        translateY.value = Math.max(0, event.translationY / 2);
                    }
                })
                .onEnd((event) => {
                    if (translateY.value > CLOSE_THRESHOLD || event.velocityY > 1000) {
                        runOnJS(closeScreen)();
                    } else {
                        translateY.value = withTiming(0, ANIMATION_CONFIG);
                        scale.value = withTiming(1, ANIMATION_CONFIG);
                    }
                }),
        []
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <>
            <Stack.Screen
                options={{
                    presentation: "transparentModal",
                    contentStyle: {
                        backgroundColor: "transparent",
                    }
                }}
            />
            <GestureDetector gesture={panGesture}>
                <Animated.View className="flex-1 bg-black" style={animatedStyle}>
                    <View
                        className="flex-1 bg-black"
                        style={{
                            marginTop: insets.top,
                            marginBottom: insets.bottom
                        }}
                    >
                        <Slot />
                    </View>
                </Animated.View>
            </GestureDetector>
        </>
    );
}
