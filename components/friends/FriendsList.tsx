import i18n from "@/i18n";
import React, { useCallback, useMemo, useState } from "react";
import { SectionList, ActivityIndicator, RefreshControl } from "react-native";
import { Contact } from "@/types/contact";
import { Friend, User } from "@/types/user";
import { useContacts } from "@/hooks/useContacts";
import { useFriends } from "@/hooks/useFriends";
import Text from "@/components/common/Text";
import UserItem from "@/components/common/UserItem";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import FriendActionButton from "@/components/friends/FriendActionButton";

interface Section {
    title: string | null;
    data: (Friend | Contact | User)[];
}

const UserItemMemo = React.memo(UserItem);

export default function FriendsList() {
    const { contacts, recommendations, isContactsLoading, isRecommendationsLoading, isContactsError, isRecommendationsError, refetchContacts, refetchRecommendations } = useContacts();
    const { friends, isFriendsLoading, isFriendsError, refetchFriends } = useFriends();
    const [refreshing, setRefreshing] = useState(false);

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
                <FriendActionButton
                    userId={item.user_id}
                    mutualStreak={item.mutual_streak}
                    friendshipStatus="friends"
                />
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
                <FriendActionButton
                    userId={item.contact_id}
                    phoneNumber={item.phone_number}
                    friendshipStatus="contact"
                />
            }
        />
    ), []);

    const renderRecommendation = useCallback(({ item, index }: { item: User, index: number }) => (
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

    const renderItem = useCallback(({ item, index }: { item: Friend | Contact | User, index: number }) => {
        if ("mutual_streak" in item) {
            return renderFriend({ item: item as Friend, index });
        } else if ("contact_id" in item) {
            return renderContact({ item: item as Contact, index });
        } else {
            return renderRecommendation({ item: item as User, index });
        }
    }, [renderFriend, renderContact, renderRecommendation]);

    const keyExtractor = useCallback((item: Friend | Contact | User) => {
        if ("mutual_streak" in item) {
            return `friend-${(item as Friend).user_id}`;
        } else if ("contact_id" in item) {
            return `contact-${(item as Contact).contact_id}`;
        } else {
            return `recommended-${(item as User).user_id}`;
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

    const refetch = useCallback(async () => {
        await Promise.all([refetchFriends(), refetchContacts(), refetchRecommendations()]);
    }, [refetchFriends, refetchContacts, refetchRecommendations]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    if (isLoading) {
        return <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />;
    }

    if (isError) {
        return <NetworkErrorContainer onRetry={refetch} />;
    }

    if (sections.length === 0) {
        return <Text type="secondary" className="text-center text-lg pt-16">{i18n.t("friends.noFriends")}</Text>;
    }

    return (
        <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={keyExtractor}
            overScrollMode="never"
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            windowSize={5}
            removeClippedSubviews={true}
            stickySectionHeadersEnabled={true}
            contentContainerClassName="pb-48"
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        />
    );
} 