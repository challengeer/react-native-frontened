import { View } from "react-native";

interface RadioButtonProps {
    selected: boolean;
}

export default function RadioButton({ selected }: RadioButtonProps) {
    return (
        <View className={`w-7 h-7 rounded-full border-2 items-center justify-center
            ${selected
                ? 'border-primary-500'
                : 'border-neutral-300 dark:border-neutral-600'
            }`}
        >
            {selected && (
                <View className="w-4 h-4 rounded-full bg-primary-500" />
            )}
        </View>
    );
}