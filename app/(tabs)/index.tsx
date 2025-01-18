import { useState } from 'react';
import { FlatList, View } from 'react-native';
import SearchBar from '@/components/SearchBar';
import CountryItem from '@/components/CountryItem';
import CountryInterface from '@/types/CountryInterface';

export default function HomeScreen() {
  const countries = require("@/assets/data/countries.json")
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCountries = countries.filter((country: CountryInterface) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dial_code.includes(searchQuery)
  );

  return (
    <View className="flex-1 px-4 gap-3">
      <SearchBar 
        onSearch={setSearchQuery}
      />

      <FlatList<CountryInterface>
        data={filteredCountries}
        keyExtractor={(item: CountryInterface) => item.code}
        renderItem={({ item }: { item: CountryInterface }) => (
          <CountryItem
            flag={item.flag}
            name={item.name}
            dial_code={item.dial_code}
          />
        )}
      />
    </View>
  );
}