import { useRef, useState } from "react";
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

    return (
        <View className="w-full flex-row items-center gap-4">
            <View className="relative flex-1 flex-row items-center">
                <Icon icon={MagnifyingGlassIcon} className="absolute top-2.5 left-4 z-10" />

                <TextInput
                    className="px-14 py-3 flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-base text-neutral-900 dark:text-neutral-100"
                    placeholderClassName="text-neutral-500 dark:text-neutral-400"
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