import StepIndicator from 'react-native-step-indicator';
import { View } from "react-native";

interface StepIndicatorBarProps {
    stepCount: number;
    currentPosition: number;
    labels: string[];
}

export default function StepIndicatorBar({ stepCount, currentPosition, labels }: StepIndicatorBarProps) {
    return (
        <View>
            <StepIndicator
                stepCount={stepCount}
                currentPosition={currentPosition}
                labels={labels}
            />
        </View>
    )
}