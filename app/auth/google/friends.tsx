import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Contacts from 'expo-contacts';
import Header from "@/components/common/Header";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import UserItem from "@/components/common/UserItem";

interface Contact {
  id: string;
  image: Contacts.Image | undefined;
  name: string;
  phoneNumber: string | undefined;
}

export default function FriendsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContacts = async () => {
    try {
      setIsLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const formattedContacts = data
            .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
            .map((contact, index) => ({
              id: contact.id || index.toString(),
              image: contact.image,
              name: contact.name,
              phoneNumber: contact.phoneNumbers![0].number,
            }));
          
          setContacts(formattedContacts);
          // Here you would typically make an API call to your backend
          // to upload contacts and get friend suggestions
          await uploadContactsToServer(formattedContacts);
        }
      } else {
        setError("Permission to access contacts was denied");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadContactsToServer = async (contacts: Contact[]) => {
    // TODO: Implement API call to upload contacts
    console.log("Uploading contacts to server...");
  };

  const handleContinue = () => {
    // Navigate to the main app
    router.replace("/(app)/(tabs)/challenges");
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <UserItem
      name={item.name}
      title={item.name}
      subtitle={item.phoneNumber}
      profilePicture={item.image?.uri}
    />
  );

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <Header title="Invite Friends" />
      
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
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              !isLoading && (
                <Text className="text-center text-gray-500">
                  No contacts found
                </Text>
              )
            }
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
