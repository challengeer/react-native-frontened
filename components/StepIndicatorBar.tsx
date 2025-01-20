import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

interface StepIndicatorBarProps {
    stepCount: number;
    currentPosition: number;
}

export default function StepIndicatorBar({ stepCount, currentPosition }: StepIndicatorBarProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: currentPosition,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [currentPosition]);

    return (
        <View style={styles.container}>
            {Array.from({ length: stepCount + 1 }).map((_, index) => ( /* +1 because we need to show the last line */
                <View key={index} style={styles.stepContainer}>
                    {index !== 0 && (
                        <Animated.View
                            style={[
                                styles.line,
                                {
                                    backgroundColor: animatedValue.interpolate({
                                        inputRange: [index - 0.5, index, index + 0.5], /* i have no clue how this works */
                                        outputRange: ['#aaaaaa', '#4aae4f', '#aaaaaa'], /* add primary color to the line NEEDS TO BE FIXED */
                                        extrapolate: 'clamp'
                                    })
                                }
                            ]}
                        />
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    line: {
        height: 2,
        flex: 1,
        marginHorizontal: 8,
    },
});