import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Text from "@/components/common/Text";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary";
    disabled?: boolean;
}

export default function Button({ title, leftSection, rightSection, size = "md", variant = "primary", disabled = false, ...props }: ButtonProps) {
    const variantStyles = {
        primary: {
            button: "bg-primary-500",
            text: "text-white"
        },
        secondary: {
            button: "bg-neutral-100 dark:bg-neutral-800",
            text: "text-neutral-900"
        },
        logout: {
            button: "bg-red-500",
            text: "text-white"
        }
    }

    const sizeStyles = {
        sm: {
            container: "py-1.5 px-3",
            text: "font-medium text-base"
        },
        md: {
            container: "py-2 px-4",
            text: "font-medium text-base"
        },
        lg: {
            container: "py-5 px-8",
            text: "font-bold text-xl"
        }
    }
    
    return (
        <TouchableOpacity
            disabled={disabled}
            className={`
                ${disabled && "opacity-20"}
                ${sizeStyles[size].container}
                ${variantStyles[variant].button}
                flex-row items-center gap-2 justify-center rounded-full
            `}
            {...props}
        >
            {leftSection}
            <Text className={`${variantStyles[variant].text} ${sizeStyles[size].text}`}>
                {title}
            </Text>
            {rightSection}
        </TouchableOpacity>
    )
}

