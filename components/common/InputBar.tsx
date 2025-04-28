import { TextInput, TextInputProps, View } from "react-native";
import { useColorScheme } from "nativewind";
import Text from "@/components/common/Text";

export interface InputBarProps extends TextInputProps {
    label?: string;
    description?: string;
    className?: string;
}

export function InputBar({
    label,
    description,
    className,
    placeholder,
    value,
    ...props
}: InputBarProps) {
    const { colorScheme } = useColorScheme();
    
    return (
        <View className={`gap-2 ${className}`}>
            {label && <Text className="font-medium">{label}</Text>}
            <View className="relative">
                <TextInput
                    className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-lg text-neutral-900 dark:text-neutral-100"
                    cursorColor="#a855f7"
                    selectionColor={colorScheme === "dark" ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"}
                    selectionHandleColor="#a855f7"
                    numberOfLines={1}
                    value={value}
                    {...props}
                />
                {!value && placeholder && (
                    <Text className="absolute left-4 top-4 text-lg text-neutral-400 dark:text-neutral-500 pointer-events-none">
                        {placeholder}
                    </Text>
                )}
            </View>
            {description && <Text type="secondary" className="text-sm">{description}</Text>}
        </View>
    )
}

export function TextAreaInputBar({
    label,
    description,
    className,
    placeholder,
    value,
    ...props
}: InputBarProps) {
    const { colorScheme } = useColorScheme();

    return (
        <View className={`gap-2 ${className}`}>
            {label && <Text className="font-medium">{label}</Text>}
            <View className="relative">
                <TextInput
                    className="p-4 min-h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-lg text-neutral-900 dark:text-neutral-100"
                    multiline
                    cursorColor="#a855f7"
                    selectionColor={colorScheme === "dark" ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"}
                    selectionHandleColor="#a855f7"
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={value}
                    {...props}
                />
                {!value && placeholder && (
                    <Text className="absolute left-4 top-4 text-lg text-neutral-400 dark:text-neutral-500 pointer-events-none">
                        {placeholder}
                    </Text>
                )}
            </View>
            {description && <Text type="secondary" className="text-sm">{description}</Text>}
        </View>
    )
}

