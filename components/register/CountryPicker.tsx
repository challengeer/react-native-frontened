import i18n from '@/i18n';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, Pressable, Keyboard } from 'react-native'
import { ChevronDownIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Text from '@/components/common/Text';
import SearchBar from '@/components/common/SearchBar';
import CountryItem from '@/components/common/CountryItem';
import CountryInterface from '@/types/CountryInterface';
import Header from '@/components/common/Header';
import IconCircle from '@/components/common/IconCircle';
import Icon from '@/components/common/Icon';

interface CountryPickerProps {
    selectedPrefix: string;
    onSelect: (prefix: string) => void;
    className?: string;
}

// Memoized CountryItem component
const MemoizedCountryItem = React.memo(({ item, onSelect }: { item: CountryInterface; onSelect: (dialCode: string) => void }) => (
    <CountryItem
        flag={item.flag}
        name={item.name}
        dial_code={item.dial_code}
        onPress={() => onSelect(item.dial_code)}
    />
));

export default function CountryPicker({ selectedPrefix, onSelect, className }: CountryPickerProps) {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";
    const insets = useSafeAreaInsets();
    const countries = require("@/assets/data/countries.json");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["100%"], []);

    // Memoize filtered countries
    const filteredCountries = useMemo(() => 
        countries.filter((country: CountryInterface) =>
            country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            country.dial_code.includes(searchQuery)
        ),
        [countries, searchQuery]
    );

    const handleSelectPrefix = useCallback((dialCode: string) => {
        onSelect(dialCode);
        bottomSheetRef.current?.dismiss();
    }, [onSelect]);

    const handleModalOpen = useCallback(() => {
        bottomSheetRef.current?.present();
        setSearchQuery("");
        Keyboard.dismiss();
    }, []);

    const handleModalClose = useCallback(() => {
        bottomSheetRef.current?.dismiss();
        setSearchQuery("");
        Keyboard.dismiss();
    }, []);

    // Memoize renderItem function
    const renderItem = useCallback(({ item }: { item: CountryInterface }) => (
        <MemoizedCountryItem item={item} onSelect={handleSelectPrefix} />
    ), [handleSelectPrefix]);

    useEffect(() => {
        const locale = i18n.locale;
        const country = countries.find((country: CountryInterface) => country.code.toLowerCase() === locale.toLowerCase());
        if (country) {
            onSelect(country.dial_code);
        }
    }, []);

    return (
        <>
            {/* Prefix Selector Button */}
            <Pressable
                onPress={handleModalOpen}
                className={`bg-neutral-100 dark:bg-neutral-800 rounded-lg flex-row items-center justify-center gap-2 p-4 ${className}`}
            >
                <Text className="text-lg text-center">{selectedPrefix}</Text>
                <Icon icon={ChevronDownIcon} size={16} />
            </Pressable>

            {/* Bottom Sheet Modal to select country prefix */}
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                backgroundStyle={{ backgroundColor }}
                enableDynamicSizing={false}
                onDismiss={handleModalClose}
                handleComponent={() => (
                    <Header
                        title={i18n.t("countryPrefix.header")}
                        style={{ marginTop: insets.top }}
                        leftSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={handleModalClose}
                            />
                        }
                    />
                )}
            >
                <View className="flex-1 px-4 gap-2">
                    {/* Search Bar */}
                    <SearchBar
                        onSearch={setSearchQuery}
                    />

                    {/* Country List */}
                    <BottomSheetFlatList
                        className="flex-1"
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: insets.bottom }}
                        data={filteredCountries}
                        keyExtractor={(item: CountryInterface) => item.code}
                        keyboardShouldPersistTaps="always"
                        renderItem={renderItem}
                        getItemLayout={(data, index) => ({
                            length: 60, // Approximate height of each item
                            offset: 60 * index,
                            index,
                        })}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                    />
                </View>
            </BottomSheetModal>
        </>
    );
}