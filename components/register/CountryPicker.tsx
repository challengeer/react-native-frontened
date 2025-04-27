import i18n from '@/i18n';
import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, Pressable } from 'react-native'
import { ChevronDownIcon, XMarkIcon } from 'react-native-heroicons/outline';
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

export default function CountryPicker({ selectedPrefix, onSelect, className }: CountryPickerProps) {
    const countries = require("@/assets/data/countries.json");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const filteredCountries = countries.filter((country: CountryInterface) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dial_code.includes(searchQuery)
    );

    const handleSelectPrefix = (dialCode: string) => {
        onSelect(dialCode);
        setIsModalVisible(false);
    };

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
                onPress={() => setIsModalVisible(true)}
                className={`bg-neutral-100 dark:bg-neutral-800 rounded-lg flex-row items-center justify-center gap-2 p-4 ${className}`}
            >
                <Text className="text-lg text-center">{selectedPrefix}</Text>
                <Icon icon={ChevronDownIcon} size={16} />
            </Pressable>

            {/* Modal to select country prefix */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onShow={() => setSearchQuery("")}
            >
                <View className="flex-1 bg-white dark:bg-neutral-900">
                    {/* Header */}
                    <Header
                        title={i18n.t("countryPrefix.header")}
                        rightSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={() => setIsModalVisible(false)}
                            />
                        }
                    />

                    <View className="px-4 gap-3 flex-1">
                        {/* Search Bar */}
                        <SearchBar
                            onSearch={setSearchQuery}
                        />

                        {/* Country List */}
                        <FlatList
                            overScrollMode="never"
                            showsVerticalScrollIndicator={false}
                            data={filteredCountries}
                            keyExtractor={(item: CountryInterface) => item.code}
                            renderItem={({ item }) => (
                                <CountryItem
                                    flag={item.flag}
                                    name={item.name}
                                    dial_code={item.dial_code}
                                    onPress={() => handleSelectPrefix(item.dial_code)}
                                />
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}