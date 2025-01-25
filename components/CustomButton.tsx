import { TouchableOpacity } from "react-native";
import Text from "@/components/Text";
import { View } from "react-native";
import { useColorScheme } from "nativewind";

interface CustomButtonProps {
    title: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    large?: boolean;
    disabled?: boolean;
    onPress?: () => void;
}

export default function CustomButton({ title, leftSection, rightSection, large = false, disabled = false, ...props }: CustomButtonProps) {

    const { colorScheme } = useColorScheme();
    const onPress = () => {
        console.log("Button pressed");
    }

    return (
        <View className="px-4">
            <TouchableOpacity
                disabled={disabled}
                className={[
                    large ? "py-4 px-6" : "py-2 px-1",
                    disabled ? "bg-gray-300" : "bg-primary-500 dark:bg-primary-400",
                    "flex-row items-center justify-center rounded-full relative",
                ].join(" ")}
                onPress={onPress}
                {...props}
            >
                {leftSection && <View className="absolute left-4">{leftSection}</View>}
                <Text className={`${disabled ? "text-purple-500" : "text-white"} justify-self-center`}>
                    {title}
                </Text>
                {rightSection && <View className="absolute right-4">{rightSection}</View>}
            </TouchableOpacity>
        </View>
    )
}

