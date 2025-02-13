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
            {label && <Text className="font-medium">{label}</Text>}
            <TextInput
                className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-lg text-neutral-900 dark:text-neutral-100"
                numberOfLines={1}
                {...props}
            />
            {description && <Text type="secondary" className="text-sm">{description}</Text>}
        </View>
    )
}