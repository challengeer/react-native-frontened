import { ActivityIndicator, Pressable, PressableProps } from "react-native";
import Text from "@/components/common/Text";
import { View } from "react-native";

interface ButtonProps extends PressableProps {
    title: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary";
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
            text: "text-neutral-900"
        },
        logout: {
            button: "bg-red-500",
            text: "text-white"
        }
    }

    const sizeStyles = {
        sm: {
            container: "py-1.5 px-2.5",
            text: "font-medium text-base"
        },
        md: {
            container: "py-3 px-4",
            text: "font-bold text-lg"
        },
        lg: {
            container: "py-5 px-8",
            text: "font-bold text-xl"
        }
    }
    
    return (
        <Pressable
            disabled={disabled}
            className={`
                ${disabled && "opacity-20"}
                ${sizeStyles[size].container}
                ${variantStyles[variant].button}
                flex-row items-center gap-1.5 justify-center rounded-full
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
                    size="small" 
                    className={`${variantStyles[variant].text} absolute`} 
                />
            )}
            <View className={loading ? 'opacity-0' : ''}>
                {rightSection}
            </View>
        </Pressable>
    )
}

