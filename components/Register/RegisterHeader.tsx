import IconCircle from "@/components/IconCircle";
import { View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Text from "@/components/Text";
import StepIndicatorBar from "@/components/StepIndicatorBar";

interface RegisterHeaderProps {
    stepCount: number;
    currentPosition: number;
}

export default function RegisterHeader({ stepCount, currentPosition }: RegisterHeaderProps) {
    return (
        <View>
            <View className="flex-row items-center gap-2 px-4 py-4">
                <IconCircle icon={ArrowLeftIcon} />
                <Text className="text-xl font-bold flex-1 text-center absolute left-1/2 -translate-x-1/2">Create account</Text>
            </View>
            <StepIndicatorBar
                stepCount={stepCount}
                currentPosition={currentPosition}
            />


        </View>
    )
}