import { TextInput, TextInputProps, View } from "react-native";
import Text from "@/components/Text";


interface InputBarProps extends TextInputProps {
    label?: string;
    description?: string;
    className?: string;
}

export default function InputBar({
    label,
    description,
    className,
    ...props
}: InputBarProps) {
    return (
        <View className={`gap-2 ${className}`}>
            <Text className="font-medium">{label}</Text>
            <TextInput
                className="px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-lg text-neutral-900 dark:text-neutral-100"
                {...props}
            />
            <Text type="secondary" className="text-sm">{description}</Text>
        </View>
    )
}