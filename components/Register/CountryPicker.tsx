import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, FlatList, Text } from 'react-native';
import i18n from '@/i18n';
import SearchBar from '@/components/SearchBar';
import CountryItem from '@/components/CountryItem';
import CountryInterface from '@/types/CountryInterface';
import Header from '@/components/Header';
import IconCircle from '@/components/IconCircle';
import { XMarkIcon } from 'react-native-heroicons/outline';

interface CountryPickerProps {
  selectedPrefix: string;
  onSelect: (prefix: string) => void;
}

export default function CountryPicker({ selectedPrefix, onSelect }: CountryPickerProps) {
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

  return (
    <>
      {/* Prefix Selector Button */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="bg-white border border-gray-200 rounded-lg py-3 px-4 w-24"
      >
        <Text className="text-lg text-center">{selectedPrefix}</Text>
      </TouchableOpacity>

      {/* Modal to select country prefix */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
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

          <View className="px-4 flex-1">
            {/* Search Bar */}
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search country or code"
            />

            {/* Country List */}
            <FlatList
              className="mt-4"
              data={filteredCountries}
              keyExtractor={(item: CountryInterface) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectPrefix(item.dial_code)}
                  className="py-3"
                >
                  <CountryItem
                    flag={item.flag}
                    name={item.name}
                    dial_code={item.dial_code}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}