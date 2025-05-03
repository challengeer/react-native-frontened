import api from "@/lib/api";
import i18n from "@/i18n";
import React, { useState, useEffect, useCallback, memo } from "react";
import { View, ActivityIndicator, Pressable, SectionList, Linking } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { useQuery, useMutation } from "@tanstack/react-query";
import * as Contacts from 'expo-contacts';
import * as Localization from 'expo-localization';
import * as SMS from 'expo-sms';
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import UserItem from "@/components/common/UserItem";
import UserInterface from "@/types/UserInterface";
import Checkbox from "@/components/common/Checkbox";

interface Section {
  title: string;
  data: UserInterface[];
}

const UserItemMemo = memo(UserItem);

export default function ContactsPage() {
  const [contacts, setContacts] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const { data: recommendations, isLoading: isRecommendationsLoading, isError: isRecommendationsError } = useQuery({
    queryKey: ["contact-recommendations"],
    queryFn: () => api.get("/contacts/recommendations"),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const sendFriendRequestsMutation = useMutation({
    mutationFn: (userIds: string[]) =>
      api.post("/friends/add/batch", { receiver_ids: userIds }),
    onSuccess: () => {
      router.replace("/(app)/(tabs)/challenges");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to send friend requests");
    }
  });

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
            contact_name: contact.display_name,
            phone_number: contact.username,
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

  const formatContacts = (contacts: Contacts.Contact[]): UserInterface[] => {
    const countryCode = (Localization.getLocales()[0].regionCode || 'US') as CountryCode;

    return contacts
      .map((contact, index) => {
        if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) return null;

        const phoneNumber = contact.phoneNumbers[0].number;
        if (!phoneNumber || phoneNumber.length < 8) return null;

        const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
        if (!parsedNumber?.isValid()) return null;

        return {
          user_id: contact.id || index.toString(),
          display_name: contact.name,
          username: parsedNumber.format('E.164').replace('+', ''),
          profile_picture: contact.image?.uri
        };
      })
      .filter((contact) => contact !== null);
  };

  const handleSkip = () => {
    // TODO: Add confirmation modal
    router.replace("/(app)/(tabs)/challenges");
  };

  const handleContinue = () => {
    const userIds = Array.from(selectedUsers);
    if (userIds.length > 0) {
      sendFriendRequestsMutation.mutate(userIds);
    } else {
      router.replace("/(app)/(tabs)/challenges");
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleInvite = async (phoneNumber: string) => {
    const message = i18n.t("auth.contacts.inviteMessage", { phoneNumber });
    const isAvailable = await SMS.isAvailableAsync();

    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [phoneNumber],
        message
      );
    } else {
      // Fallback to regular SMS link
      const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
      Linking.openURL(smsUrl);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const renderRecommendedUser = useCallback(({ item, index }: { item: UserInterface, index: number }) => {
    const isSelected = selectedUsers.has(item.user_id);

    return (
      <UserItemMemo
        index={index}
        name={item.display_name}
        title={item.display_name}
        subtitle={`@${item.username}`}
        profilePicture={item.profile_picture}
        onPress={() => toggleUserSelection(item.user_id)}
        rightSection={
          <Checkbox
            checked={isSelected}
          />
        }
      />
    );
  }, [selectedUsers]);

  const renderContact = useCallback(({ item, index }: { item: UserInterface, index: number }) => (
    <UserItemMemo
      index={index}
      name={item.display_name}
      title={item.display_name}
      subtitle={`+${item.username}`}
      profilePicture={item.profile_picture}
      rightSection={
        <Button
          size="sm"
          title={i18n.t("auth.contacts.invite")}
          onPress={() => handleInvite(item.username)}
        />
      }
      disabled
    />
  ), []);

  const renderItem = useCallback(({ item, section, index }: { item: UserInterface, section: Section, index: number }) => {
    if (section.title === i18n.t("auth.contacts.recommended")) {
      return renderRecommendedUser({ item, index });
    }
    return renderContact({ item, index });
  }, [renderRecommendedUser, renderContact]);

  const keyExtractor = useCallback((item: UserInterface) => item.user_id, []);

  const sections: Section[] = [
    {
      title: i18n.t("auth.contacts.recommended"),
      data: recommendations?.data || [],
    },
    {
      title: i18n.t("auth.contacts.contacts"),
      data: contacts,
    },
  ];

  const renderSectionHeader = useCallback(({ section }: { section: Section }) => (
    <Text className="px-4 pt-4 pb-2 text-lg font-bold">{section.title}</Text>
  ), []);

  return (
    <SafeAreaView className="flex-1">
      <Header
        title={i18n.t("auth.contacts.header")}
        rightSection={
          <Pressable onPress={handleSkip}>
            <Text type="secondary" className="text-sm font-medium">{i18n.t("auth.contacts.skip")}</Text>
          </Pressable>
        }
      />

      <View className="flex-1">
        {error ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : isLoading || isRecommendationsLoading ? (
          <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />
        ) : (
          <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={keyExtractor}
            overScrollMode="never"
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: 72,
              offset: 72 * index,
              index,
            })}
          />
        )}
      </View>

      <View className="p-4">
        <Button
          title={i18n.t("auth.contacts.button")}
          size="lg"
          onPress={handleContinue}
          loading={sendFriendRequestsMutation.isPending}
        />
      </View>
    </SafeAreaView>
  );
}
