import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Text from "@/components/Text";

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    large?: boolean;
    disabled?: boolean;
}

export default function CustomButton({ title, leftSection, rightSection, large = false, disabled = false, ...props }: CustomButtonProps) {
    return (
        <TouchableOpacity
            disabled={disabled}
            className={`${large ? "py-5 px-8" : "py-2 px-4"} ${disabled && "opacity-20"} bg-primary-500 flex-row items-center justify-center rounded-full`}
            {...props}
        >
            {leftSection}
            <Text className={`text-white ${large && "font-bold text-xl"}`}>
                {title}
            </Text>
            {rightSection}
        </TouchableOpacity>
    )
}

