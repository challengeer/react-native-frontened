import { View } from "react-native";

interface StepIndicatorBarProps {
    stepCount: number;
    currentPosition: number;
    className?: string;
}

export default function StepIndicatorBar({ stepCount, currentPosition, className = "" }: StepIndicatorBarProps) {
    return (
        <View className={`flex-row items-center justify-between gap-1.5 ${className}`}>
            {Array.from({ length: stepCount }).map((_, index) => (
                <View
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${index === (currentPosition - 1)
                            ? "bg-primary-500"
                            : "bg-neutral-100 dark:bg-neutral-800"
                        }`}
                />
            ))}
        </View>
    );
}