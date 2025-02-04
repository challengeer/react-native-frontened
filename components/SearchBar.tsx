import i18n from "@/i18n";
import { useCallback, useRef, useState } from "react";
import { debounce } from "lodash";
import { useColorScheme } from "nativewind";
import { TextInput, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { XCircleIcon } from "react-native-heroicons/solid";
import Icon from "@/components/Icon";

interface SearchBarProps {
    onSearch?: (query: string) => void;
    inputRef?: React.RefObject<TextInput>;
}

export default function SearchBar({ onSearch, inputRef: externalRef }: SearchBarProps) {
    const internalRef = useRef<TextInput>(null);
    const inputRef = externalRef || internalRef;
    const [value, setValue] = useState<string>("");

    const { colorScheme } = useColorScheme();
    const placeholderColor = colorScheme === "dark" ? "#a3a3a3" : "#737373";

    const debouncedSearch = onSearch ? useCallback(debounce(onSearch, 500), []) : undefined;

    return (
        <View className="relative flex-1 flex-row items-center">
            <View className="absolute top-3 left-4 z-10">
                <Icon
                    icon={MagnifyingGlassIcon}
                    lightColor="#737373"
                    darkColor="#a3a3a3"
                    onPress={() => inputRef.current?.focus()}
                />
            </View>

            <TextInput
                ref={inputRef}
                className="px-14 py-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg text-lg text-neutral-900 dark:text-neutral-100"
                placeholderTextColor={placeholderColor}
                placeholder={i18n.t("searchBar.placeholder")}
                value={value}
                onChangeText={(text) => {
                    setValue(text);
                    debouncedSearch?.(text);
                }}
                numberOfLines={1}
            />
            {value && (
                <View className="absolute top-3 right-4 z-10">
                    <Icon
                        icon={XCircleIcon}
                        lightColor="#737373"
                        darkColor="#a3a3a3"
                        onPress={() => {
                            setValue("");
                            onSearch?.("");
                            inputRef.current?.blur();
                        }}
                    />
                </View>
            )}
        </View>
    )
}