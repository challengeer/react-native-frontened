import i18n from "@/i18n";
import { useRef, useState } from "react";
import { useColorScheme } from "nativewind";
import { TextInput, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { XCircleIcon } from "react-native-heroicons/solid";
import Text from "@/components/Text";
import Icon from "@/components/Icon";

interface SearchBarProps {
    onCancel?: () => void;
    onSearch?: (query: string) => void;
}

export default function SearchBar({ onCancel, onSearch }: SearchBarProps) {
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    const { colorScheme } = useColorScheme();
    const placeholderColor = colorScheme === "dark" ? "#a3a3a3" : "#737373";

    return (
        <View className="w-full flex-row items-center gap-4">
            <View className="relative flex-1 flex-row items-center">
                <Icon
                    icon={MagnifyingGlassIcon}
                    className="absolute top-3 left-4 z-10"
                    lightColor="#737373"
                    darkColor="#a3a3a3"
                    onPress={() => inputRef.current?.focus()}
                />

                <TextInput
                    ref={inputRef}
                    className="px-14 py-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg text-lg text-neutral-900 dark:text-neutral-100"
                    placeholderTextColor={placeholderColor}
                    placeholder={i18n.t("searchBar.placeholder")}
                    value={value}
                    onChangeText={(text) => {
                        setValue(text);
                        onSearch?.(text);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    numberOfLines={1}
                />
                {value && (
                    <Icon
                        icon={XCircleIcon}
                        className="absolute top-3 right-4 z-10"
                        lightColor="#737373"
                        darkColor="#a3a3a3"
                        onPress={() => {
                            setValue("");
                            onSearch?.("");
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
                >
                    {i18n.t("searchBar.cancel")}
                </Text>
            )}
        </View>
    )
}