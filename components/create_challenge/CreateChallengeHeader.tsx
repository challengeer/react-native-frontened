import { View } from "react-native";
import Text from "@/components/common/Text";
import StepIndicatorBar from "@/components/common/StepIndicatorBar";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

interface CreateChallengeHeaderProps {
    currentStep: number;
    onBack: () => void;
}

export default function CreateChallengeHeader({ currentStep, onBack }: CreateChallengeHeaderProps) {
    return (
        <View>
            <Header
                title="Create Challenge"
                leftSection={
                    <IconCircle icon={ArrowLeftIcon} onPress={onBack} />
                }
            />
            <StepIndicatorBar
                stepCount={3}
                currentPosition={currentStep}
                className="px-4 pt-2"
            />
        </View>
    );
}       
