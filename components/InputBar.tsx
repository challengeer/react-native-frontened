import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import Text from "@/components/Text";
import Icon from "@/components/Icon";
import { XCircleIcon } from "react-native-heroicons/solid";


interface InputBarProps {
    onCancel?: () => void;
    label?: string;
    description?: string;
}

export default function InputBar({ onCancel, label, description }: InputBarProps) {
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    return (
        <View className="px-4 mt-10">
            <View className="flex-row items-center">
                <View className="relative flex-1 flex-row items-center">
                    <Text className="absolute text-base text-neutral-800 dark:text-neutral-100 -top-7">{label}</Text>
                    <TextInput
                        ref={inputRef}
                        className="px-4 py-3 flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-lg text-neutral-900 dark:text-neutral-100"
                        value={value}
                        onChangeText={(text) => {
                            setValue(text);
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                    {value && (
                        <Icon
                            icon={XCircleIcon}
                            className="absolute right-4 z-10"
                            lightColor="#737373"
                            darkColor="#a3a3a3"
                            onPress={() => {
                                setValue("");
                                inputRef.current?.blur();
                            }}
                        />
                    )}
                </View>
                {focused && (
                    <Text
                        onPress={() => {
                            setFocused(false);
                            onCancel?.();
                            inputRef.current?.blur();
                        }}
                        className="text-base text-neutral-900 dark:text-neutral-100 p-4 pr-0"
                    >
                        Cancel
                    </Text>
                )}
            </View>
            <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-3">{description}</Text>
        </View>
    )
}