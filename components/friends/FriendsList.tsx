import i18n from "@/i18n";
import React, { useCallback, useMemo } from "react";
import { SectionList, ActivityIndicator } from "react-native";
import { UserPlusIcon } from "react-native-heroicons/solid";
import { Linking } from "react-native";
import { useContacts } from "@/hooks/useContacts";
import { useFriends } from "@/hooks/useFriends";
import Icon from "@/components/common/Icon";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import UserInterface from "@/types/UserInterface";
import UserItem from "@/components/common/UserItem";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import FriendActionButton from "@/components/common/FriendActionButton";

interface Friend extends UserInterface {
    mutual_streak: number;
}

interface Contact {
    contact_id: string;
    contact_name: string;
    phone_number: string;
}

interface Section {
    title: string | null;
    data: (Friend | Contact | UserInterface)[];
}

const UserItemMemo = React.memo(UserItem);

export default function FriendsList() {
    const { contacts, recommendations, isContactsLoading, isRecommendationsLoading, isContactsError, isRecommendationsError, refetchContacts, refetchRecommendations } = useContacts();
    const { friends, isFriendsLoading, isFriendsError, refetchFriends } = useFriends();

    const handleInvite = async (phoneNumber: string) => {
        const message = i18n.t("auth.contacts.inviteMessage", { phoneNumber });
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        Linking.openURL(smsUrl);
    };

    const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
        if (section.data.length === 0 || section.title === null) return null;
        return <Text className="px-4 pt-4 pb-2 text-lg font-bold bg-white dark:bg-neutral-900">{section.title}</Text>;
    }, []);

    const renderFriend = useCallback(({ item, index }: { item: Friend, index: number }) => (
        <UserItemMemo
            key={item.user_id}
            index={index}
            userId={item.user_id}
            title={item.display_name}
            subtitle={`@${item.username}`}
            name={item.display_name}
            profilePicture={item.profile_picture}
            rightSection={
                <Text className="text-purple-500 font-semibold">{item.mutual_streak}🔥</Text>
            }
        />
    ), []);

    const renderContact = useCallback(({ item, index }: { item: Contact, index: number }) => (
        <UserItemMemo
            key={item.contact_id}
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
                    leftSection={
                        <Icon
                            icon={UserPlusIcon}
                            lightColor="white"
                            darkColor="white"
                        />
                    }
                />
            }
        />
    ), []);

    const renderRecommendation = useCallback(({ item, index }: { item: UserInterface, index: number }) => (
        <UserItemMemo
            key={item.user_id}
            index={index}
            userId={item.user_id}
            title={item.display_name}
            subtitle={`@${item.username}`}
            name={item.display_name}
            profilePicture={item.profile_picture}
            rightSection={
                <FriendActionButton
                    userId={item.user_id}
                    friendshipStatus="none"
                />
            }
        />
    ), []);

    const renderItem = useCallback(({ item, index }: { item: Friend | Contact | UserInterface, index: number }) => {
        if ("mutual_streak" in item) {
            return renderFriend({ item: item as Friend, index });
        } else if ("contact_id" in item) {
            return renderContact({ item: item as Contact, index });
        } else {
            return renderRecommendation({ item: item as UserInterface, index });
        }
    }, [renderFriend, renderContact, renderRecommendation]);

    const keyExtractor = useCallback((item: Friend | Contact | UserInterface) => {
        if ("mutual_streak" in item) {
            return `friend-${(item as Friend).user_id}`;
        } else if ("contact_id" in item) {
            return `contact-${(item as Contact).contact_id}`;
        } else {
            return `recommended-${(item as UserInterface).user_id}`;
        }
    }, []);

    const sections: Section[] = useMemo(() => [
        {
            title: null,
            data: friends || [],
        },
        {
            title: i18n.t("friends.recommendations"),
            data: recommendations || [],
        },
        {
            title: i18n.t("friends.contacts"),
            data: (contacts || []).slice(0, 20),
        },
    ], [friends, recommendations, contacts]);

    const isLoading = isFriendsLoading || isContactsLoading || isRecommendationsLoading;
    const isError = isFriendsError || isContactsError || isRecommendationsError;

    const retry = useCallback(() => {
        refetchFriends();
        refetchContacts();
        refetchRecommendations();
    }, [refetchFriends, refetchContacts, refetchRecommendations]);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#a855f7" />;
    }

    if (isError) {
        return <NetworkErrorContainer onRetry={retry} />;
    }

    return (
        <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={keyExtractor}
            overScrollMode="never"
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
        />
    );
} 