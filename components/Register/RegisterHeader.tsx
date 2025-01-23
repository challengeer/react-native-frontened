import IconCircle from "@/components/IconCircle";
import { View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import StepIndicatorBar from "@/components/StepIndicatorBar";
import Header from "@/components/Header";

interface RegisterHeaderProps {
    stepCount: number;
    currentPosition: number;
}

export default function RegisterHeader({ stepCount, currentPosition }: RegisterHeaderProps) {
    return (
        <View>
            <Header title="Create account" leftSection={<IconCircle icon={ArrowLeftIcon} />} />
            <StepIndicatorBar
                stepCount={stepCount}
                currentPosition={currentPosition}
                className="px-4"
            />
        </View>
    )
}