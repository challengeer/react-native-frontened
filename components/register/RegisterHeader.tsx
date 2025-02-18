import i18n from "@/i18n";
import IconCircle from "@/components/common/IconCircle";
import { View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import StepIndicatorBar from "@/components/common/StepIndicatorBar";
import Header from "@/components/common/Header";
import { router } from "expo-router";

interface RegisterHeaderProps {
    stepCount: number;
    currentPosition: number;
}

export default function RegisterHeader({ stepCount, currentPosition }: RegisterHeaderProps) {
    return (
        <View>
            <Header
                title={i18n.t("register.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />
            <StepIndicatorBar
                stepCount={stepCount}
                currentPosition={currentPosition}
                className="px-4"
            />
        </View>
    )
}