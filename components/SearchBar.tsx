import { useState } from "react";
import { useColorScheme } from "nativewind";
import { TextInput, View, Keyboard } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { XCircleIcon } from "react-native-heroicons/solid";
import Text from "@/components/Text";
import Icon from "@/components/Icon";

interface SearchBarProps {
    onCancel?: () => void;
    onSearch?: (query: string) => void;
}

export default function SearchBar({ onCancel, onSearch }: SearchBarProps) {
    const [focused, setFocused] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    const { colorScheme } = useColorScheme();
    const placeholderColor = colorScheme === "dark" ? "#a3a3a3" : "#737373";

    return (
        <View className="w-full flex-row items-center gap-4">
            <View className="relative flex-1 flex-row items-center">
                <Icon
                    icon={MagnifyingGlassIcon}
                    className="absolute top-2.5 left-4 z-10"
                    lightColor="#737373"
                    darkColor="#a3a3a3"
                />

                <TextInput
                    className="px-14 py-3 flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-base text-neutral-900 dark:text-neutral-100"
                    placeholderTextColor={placeholderColor}
                    placeholder="Search"
                    value={value}
                    onChangeText={(text) => {
                        setValue(text);
                        onSearch?.(text);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {value && (
                    <Icon
                        icon={XCircleIcon}
                        className="absolute top-2.5 right-4 z-10"
                        lightColor="#737373"
                        darkColor="#a3a3a3"
                        onPress={() => {
                            setValue("");
                            onSearch?.("");
                            Keyboard.dismiss();
                        }}
                    />
                )}
            </View>
            {focused && (
                <Text
                    onPress={() => {
                        setFocused(false);
                        onCancel?.();
                        Keyboard.dismiss();
                    }}
                >
                    Cancel
                </Text>
            )}
        </View>
    )
}