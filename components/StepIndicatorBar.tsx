import { View } from "react-native";

interface StepIndicatorBarProps {
    stepCount: number;
    currentPosition: number;
}

export default function StepIndicatorBar({ stepCount, currentPosition }: StepIndicatorBarProps) {
    return (
        <View className="flex-row items-center justify-between px-4 pb-3">
            {Array.from({ length: stepCount + 1 }).map((_, index) => (
                <View key={index} className="flex-row items-center flex-1 -translate-x-1/2"> {/* To make the elemnt centered */}
                    {index !== 0 && (
                        <View
                            className={`h-0.5 flex-1 mx-2 ${index <= currentPosition ? 'bg-[#4aae4f]' : 'bg-[#aaaaaa]'}`}
                        />
                    )}
                </View>
            ))}
        </View>
    );
}