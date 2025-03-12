import { useEffect, useMemo } from "react";
import { Dimensions } from "react-native";
import { router, Slot, useNavigation } from "expo-router";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants moved outside component
const SCREEN_HEIGHT = Dimensions.get("window").height;
const CLOSE_THRESHOLD = SCREEN_HEIGHT / 4;
const ANIMATION_CONFIG = { duration: 200 };

export default function SubmissionLayout() {
    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);
    const navigation = useNavigation();

    useEffect(() => {
        scale.value = withTiming(1, ANIMATION_CONFIG);

        const unsubscribe = navigation.addListener("beforeRemove", (e) => {            
            scale.value = withTiming(0, ANIMATION_CONFIG);
        });

        return unsubscribe;
    }, [navigation]);

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
                    const shouldClose =
                        translateY.value > CLOSE_THRESHOLD || event.velocityY > 1000;

                    if (translateY.value > CLOSE_THRESHOLD || event.velocityY > 1000) {
                        runOnJS(closeScreen)();
                    }

                    // Animate both values regardless of close state
                    translateY.value = withTiming(0, ANIMATION_CONFIG);
                    scale.value = withTiming(shouldClose ? 0 : 1, ANIMATION_CONFIG);
                }),
        []
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <SafeAreaView className="flex-1 bg-black">
            <GestureDetector gesture={panGesture}>
                <Animated.View className="flex-1" style={animatedStyle}>
                    <Slot />
                </Animated.View>
            </GestureDetector>
        </SafeAreaView>
    );
}
