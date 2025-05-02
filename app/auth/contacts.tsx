import api from "@/lib/api";
import i18n from "@/i18n";
import React, { useState, useEffect, useCallback, memo } from "react";
import { View, FlatList, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import * as Contacts from 'expo-contacts';
import * as Localization from 'expo-localization';
import Header from "@/components/common/Header";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import UserItem from "@/components/common/UserItem";

interface Contact {
  id: string;
  image: Contacts.Image | undefined;
  name: string;
  phoneNumber: string;
}

const UserItemMemo = memo(UserItem);

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContacts = async () => {
    try {
      setIsLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.ID,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Name,
            Contacts.Fields.Image
          ],
        });

        if (data.length > 0) {
          const formattedContacts = formatContacts(data);
          setContacts(formattedContacts);

          const apiContacts = formattedContacts.map((contact) => ({
            contact_name: contact.name,
            phone_number: contact.phoneNumber,
          }));

          await api.post("/contacts/upload", {
            contacts: apiContacts,
          });
        }
      } else {
        router.replace("/(app)/(tabs)/challenges");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  }

  const formatContacts = (contacts: Contacts.Contact[]) => {
    const countryCode = (Localization.getLocales()[0].regionCode || 'US') as CountryCode;

    return contacts
      .map((contact, index) => {
        if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) return null;

        const phoneNumber = contact.phoneNumbers[0].number;
        if (!phoneNumber || phoneNumber.length < 8) return null;

        const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
        if (!parsedNumber?.isValid()) return null;

        return {
          id: contact.id || index.toString(),
          image: contact.image,
          name: contact.name,
          phoneNumber: parsedNumber.format('E.164').replace('+', '')
        };
      })
      .filter((contact): contact is Contact => contact !== null);
  };

  const handleSkip = () => {
    router.replace("/(app)/(tabs)/challenges");
  };

  const handleContinue = () => {
    // Navigate to the main app
    router.replace("/(app)/(tabs)/challenges");
  };

  useEffect(() => {
    getContacts();
  }, []);

  const renderContact = useCallback(({ item }: { item: Contact }) => (
    <UserItemMemo
      name={item.name}
      title={item.name}
      subtitle={item.phoneNumber}
      profilePicture={item.image?.uri}
    />
  ), []);

  const keyExtractor = useCallback((item: Contact) => item.id, []);

  return (
    <SafeAreaView className="flex-1">
      <Header
        title={i18n.t("auth.contacts.header")}
        rightSection={
          <Pressable onPress={handleSkip}>
            <Text type="secondary" className="text-sm">{i18n.t("auth.contacts.skip")}</Text>
          </Pressable>
        }
      />

      <View className="flex-1">
        <Text className="text-xl font-bold mb-4">Connect with Friends</Text>
        <Text className="text-base text-neutral-500 mb-6">
          Find friends who are already using the app
        </Text>

        {error ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : isLoading ? (
          <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />
        ) : (
          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={keyExtractor}
            overScrollMode="never"
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: 72, // Height of each item
              offset: 72 * index,
              index,
            })}
          />
        )}
      </View>

      <View className="p-4">
        <Button
          title="Continue"
          size="lg"
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}
