import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Text from "@/components/Text";

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    large?: boolean;
    secondary?: boolean;
    disabled?: boolean;
}

export default function CustomButton({ title, leftSection, rightSection, large = false, secondary = false, disabled = false, ...props }: CustomButtonProps) {
    return (
        <TouchableOpacity
            disabled={disabled}
            className={`${large ? "py-5 px-8" : "py-1.5 px-3"} ${disabled && "opacity-20"} ${secondary ? "bg-neutral-100 dark:bg-neutral-800" : "bg-primary-500"} flex-row items-center gap-2 justify-center rounded-full`}
            {...props}
        >
            {leftSection}
            <Text className={`${secondary ? "text-neutral-900" : "text-white"} ${large ? "font-bold text-xl" : "font-medium text-base"}`}>
                {title}
            </Text>
            {rightSection}
        </TouchableOpacity>
    )
}

