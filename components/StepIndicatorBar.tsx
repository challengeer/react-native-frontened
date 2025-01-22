import { View } from "react-native";
import { useColorScheme } from "nativewind";

interface StepIndicatorBarProps {
    stepCount: number;
    currentPosition: number;
}

export default function StepIndicatorBar({ stepCount, currentPosition }: StepIndicatorBarProps) {

    const { colorScheme } = useColorScheme();
    const currentStepColor = colorScheme === "dark" ? "#a855f7" : "#9333ea";
    const otherStepColor = colorScheme === "dark" ? "#262626" : "#f5f5f5";

    return (
        <View className="flex-row items-center justify-between px-4 pb-3">
            {Array.from({ length: stepCount + 1 }).map((_, index) => (
                <View key={index} className="flex-row items-center flex-1 -translate-x-1/2"> {/* To make the elemnt centered */}
                    {index !== 0 && (
                        <View
                            style={{ backgroundColor: index <= currentPosition ? currentStepColor : otherStepColor }} /* There was no other way to add colors */
                            className="h-0.5 flex-1 mx-2"
                        />
                    )}
                </View>
            ))}
        </View>
    );
}