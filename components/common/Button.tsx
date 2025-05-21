import { ActivityIndicator, Pressable, PressableProps } from "react-native";
import Text from "@/components/common/Text";
import { View } from "react-native";

interface ButtonProps extends PressableProps {
    title: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "logout";
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export default function Button({ title, leftSection, rightSection, size = "md", variant = "primary", disabled = false, loading = false, className, ...props }: ButtonProps) {
    const variantStyles = {
        primary: {
            button: "bg-primary-500",
            text: "text-white"
        },
        secondary: {
            button: "bg-neutral-100 dark:bg-neutral-800",
            text: "text-black dark:text-white"
        },
        logout: {
            button: "bg-red-500",
            text: "text-white"
        }
    }

    const sizeStyles = {
        sm: {
            container: "py-1.5 px-4 gap-1.5 rounded-lg",
            text: "font-medium text-base",
            activityIndicator: "small",
        },
        md: {
            container: "py-3 px-6 gap-2 rounded-xl",
            text: "font-bold text-lg",
            activityIndicator: 28,
        },
        lg: {
            container: "py-5 px-8 gap-3 rounded-xl",
            text: "font-bold text-xl",
            activityIndicator: "large",
        }
    }
    
    return (
        <Pressable
            disabled={disabled}
            className={`
                ${disabled && "opacity-20"}
                ${sizeStyles[size].container}
                ${variantStyles[variant].button}
                flex-row items-center justify-center
                ${className}
            `}
            {...props}
        >
            <View className={loading ? 'opacity-0' : ''}>
                {leftSection}
            </View>
            <Text 
                className={`
                    ${variantStyles[variant].text} 
                    ${sizeStyles[size].text}
                    ${loading ? 'opacity-0' : ''}
                `}
            >
                {title}
            </Text>
            {loading && (
                <ActivityIndicator
                    size={sizeStyles[size].activityIndicator as "small" | "large"}
                    className={`${variantStyles[variant].text} absolute`}
                />
            )}
            <View className={loading ? 'opacity-0' : ''}>
                {rightSection}
            </View>
        </Pressable>
    )
}

