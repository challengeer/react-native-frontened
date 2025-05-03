import api from "@/lib/api";
import i18n from "@/i18n";
import React, { useState, useCallback, memo, useMemo } from "react";
import { View, ActivityIndicator, Pressable, SectionList, Linking } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContacts } from "@/hooks/useContacts";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import UserItem from "@/components/common/UserItem";
import UserInterface from "@/types/UserInterface";
import Checkbox from "@/components/common/Checkbox";
import SearchBar from "@/components/common/SearchBar";

interface Contact {
  contact_id: string;
  contact_name: string;
  phone_number: string;
}

interface Section {
  title: string;
  data: (UserInterface | Contact)[];
}

const UserItemMemo = memo(UserItem);

// Custom hook for fetching contacts sorted by interest
const useContactsByInterest = (isContactsSynced: boolean) => {
  return useQuery<Contact[]>({
    queryKey: ["contacts-by-interest"],
    queryFn: async () => {
      const response = await api.get("/contacts/sorted-by-interest");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: isContactsSynced,
  });
};

// Custom hook for fetching recommendations
const useContactRecommendations = (isContactsSynced: boolean) => {
  return useQuery<UserInterface[]>({
    queryKey: ["contact-recommendations"],
    queryFn: async () => {
      const response = await api.get("/contacts/recommendations");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: isContactsSynced,
  });
};

// Custom hook for sending friend requests
const useSendFriendRequests = () => {
  return useMutation({
    mutationFn: async (userIds: string[]) =>
      await api.post("/friends/add/batch", { receiver_ids: userIds }),
    onSuccess: () => {
      router.replace("/(app)/(tabs)/challenges");
    },
  });
};

export default function ContactsPage() {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading: isDeviceContactsLoading, error: deviceContactsError, isContactsSynced } = useContacts();
  const { data: contacts, isPending: isContactsLoading, isError: isContactsError } = useContactsByInterest(isContactsSynced);
  const { data: recommendations, isPending: isRecommendationsLoading, isError: isRecommendationsError } = useContactRecommendations(isContactsSynced);
  const { mutate: sendFriendRequests, isPending: isSendingRequests } = useSendFriendRequests();

  const filteredContacts = useMemo(() => {
    if (!searchQuery || !contacts) return contacts || [];
    const query = searchQuery.toLowerCase();
    return contacts.filter((contact: Contact) => 
      contact.contact_name.toLowerCase().includes(query) ||
      contact.phone_number.includes(query)
    );
  }, [contacts, searchQuery]);

  const filteredRecommendations = useMemo(() => {
    if (!searchQuery || !recommendations) return recommendations || [];
    const query = searchQuery.toLowerCase();
    return recommendations.filter((user: UserInterface) => 
      user.display_name.toLowerCase().includes(query) ||
      user.username.includes(query)
    );
  }, [recommendations, searchQuery]);

  const handleSkip = () => {
    router.replace("/(app)/(tabs)/challenges");
  };

  const handleContinue = () => {
    const userIds = Array.from(selectedUsers);
    if (userIds.length > 0) {
      sendFriendRequests(userIds);
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
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    Linking.openURL(smsUrl);
  };

  const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
    if (section.data.length === 0) return null;
    return <Text className="px-4 pt-4 pb-2 text-lg font-bold">{section.title}</Text>
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

  const renderContact = useCallback(({ item, index }: { item: Contact, index: number }) => (
    <UserItemMemo
      index={index}
      disabled
      name={item.contact_name}
      title={item.contact_name}
      subtitle={`+${item.phone_number}`}
      rightSection={
        <Button
          size="sm"
          title={i18n.t("auth.contacts.invite")}
          onPress={() => handleInvite(item.phone_number)}
        />
      }
    />
  ), []);

  const renderItem = useCallback(({ item, index }: { item: UserInterface | Contact, index: number }) => {
    if ("contact_id" in item) {
      return renderContact({ item: item as Contact, index });
    }
    return renderRecommendedUser({ item: item as UserInterface, index });
  }, [renderRecommendedUser, renderContact]);

  const keyExtractor = useCallback((item: UserInterface | Contact) => {
    if ("contact_id" in item) {
      return `contact-${(item as Contact).contact_id}`;
    }
    return `recommended-${(item as UserInterface).user_id}`;
  }, []);

  const sections: Section[] = [
    {
      title: i18n.t("auth.contacts.recommended"),
      data: filteredRecommendations,
    },
    {
      title: i18n.t("auth.contacts.contacts"),
      data: filteredContacts,
    },
  ];

  const isLoading = isDeviceContactsLoading || isContactsLoading || isRecommendationsLoading;
  const isError = deviceContactsError || isContactsError || isRecommendationsError;

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

      <View className="px-4 pb-2">
        <SearchBar onSearch={setSearchQuery} />
      </View>

      <View className="flex-1">
        {isError ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-red-500 text-center">Something went wrong</Text>
          </View>
        ) : isLoading ? (
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
            getItemLayout={(_, index) => ({
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
          loading={isSendingRequests}
        />
      </View>
    </SafeAreaView>
  );
}
