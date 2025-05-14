import { SectionList, View } from "react-native";
import { UserPlusIcon, XMarkIcon } from "react-native-heroicons/solid";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, Linking } from "react-native";
import { ContactRecommendation, useContacts } from "@/hooks/useContacts";
import { FriendRequest, Friend, useFriends } from "@/hooks/useFriends";
import i18n from "@/i18n";
import UserItem from "@/components/common/UserItem";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import UserInterface from "@/types/UserInterface";
import FriendActionButton from "@/components/common/FriendActionButton";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import { useFriendActions } from "@/hooks/useFriendActions";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";

interface Section {
    title: string;
    data: (FriendRequest | Friend | ContactRecommendation)[];
}

const UserItemMemo = React.memo(UserItem);

export default function FriendRequestsList({ search }: { search: string }) {
    const { friendRequests, isFriendRequestsLoading, isFriendRequestsError, refetchFriendRequests } = useFriends();
    const { contacts, recommendations, isContactsLoading, isRecommendationsLoading, isContactsError, isRecommendationsError, refetchContacts, refetchRecommendations } = useContacts();
    const { acceptRequest, rejectRequest } = useFriendActions();

    const filteredFriendRequests = useMemo(() => {
        return friendRequests?.filter((request) =>
            request.display_name.toLowerCase().includes(search.toLowerCase()) ||
            request.username.toLowerCase().includes(search.toLowerCase())
        );
    }, [friendRequests, search]);

    const filteredRecommendations = useMemo(() => {
        return recommendations?.filter((recommendation) =>
            recommendation.display_name.toLowerCase().includes(search.toLowerCase()) ||
            recommendation.username.toLowerCase().includes(search.toLowerCase())
        );
    }, [recommendations, search]);

    const filteredContacts = useMemo(() => {
        return contacts?.filter((contact) =>
            contact.contact_name.toLowerCase().includes(search.toLowerCase()) ||
            contact.phone_number.includes(search)
        ).slice(0, 20);
    }, [contacts, search]);

    const handleInvite = async (phoneNumber: string) => {
        const message = i18n.t("auth.contacts.inviteMessage", { phoneNumber });
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        Linking.openURL(smsUrl);
    };

    const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
        if (section.data.length === 0) return null;
        return <Text className="px-4 pt-4 pb-2 text-lg font-bold bg-white dark:bg-neutral-900">{section.title}</Text>;
    }, []);

    const renderFriendRequest = useCallback(({ item, index }: { item: FriendRequest, index: number }) => (
        <UserItemMemo
            key={item.user_id}
            index={index}
            userId={item.user_id}
            title={item.display_name}
            subtitle={`@${item.username}`}
            name={item.display_name}
            profilePicture={item.profile_picture}
            rightSection={
                <View className="flex-row items-center gap-2">
                    <Button
                        size="sm"
                        title={i18n.t("friendActionButton.accept")}
                        onPress={() => item.request_id && acceptRequest.mutate(item.request_id)}
                        leftSection={
                            <Icon
                                icon={UserPlusIcon}
                                lightColor="white"
                                darkColor="white"
                            />
                        }
                    />
                    <Icon
                        icon={XMarkIcon}
                        onPress={() => item.request_id && rejectRequest.mutate(item.request_id)}
                    />
                </View>
            }
        />
    ), []);

    const renderContact = useCallback(({ item, index }: { item: ContactRecommendation, index: number }) => (
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

    const renderItem = useCallback(({ item, index }: { item: FriendRequest | ContactRecommendation | UserInterface, index: number }) => {
        if ("mutual_streak" in item) {
            return renderFriendRequest({ item: item as FriendRequest, index });
        } else if ("contact_id" in item) {
            return renderContact({ item: item as ContactRecommendation, index });
        } else {
            return renderRecommendation({ item: item as UserInterface, index });
        }
    }, [renderFriendRequest, renderContact, renderRecommendation]);

    const keyExtractor = useCallback((item: FriendRequest | ContactRecommendation | UserInterface) => {
        if ("mutual_streak" in item) {
            return `friend-${(item as FriendRequest).user_id}`;
        } else if ("contact_id" in item) {
            return `contact-${(item as ContactRecommendation).contact_id}`;
        } else {
            return `recommended-${(item as UserInterface).user_id}`;
        }
    }, []);

    const sections: Section[] = useMemo(() => [
        {
            title: "Received Requests",
            data: filteredFriendRequests || [],
        },
        {
            title: "Sent Requests",
            data: filteredFriendRequests || [],
        },
        {
            title: i18n.t("friends.recommendations"),
            data: filteredRecommendations || [],
        },
        {
            title: i18n.t("friends.contacts"),
            data: filteredContacts || [],
        },
    ], [filteredFriendRequests, filteredRecommendations, filteredContacts]);

    const isLoading = isFriendRequestsLoading || isContactsLoading || isRecommendationsLoading;
    const isError = isFriendRequestsError || isContactsError || isRecommendationsError;

    const retry = useCallback(() => {
        refetchFriendRequests();
        refetchRecommendations();
        refetchContacts();
    }, [refetchFriendRequests, refetchRecommendations, refetchContacts]);

    if (isLoading) {
        return <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />;
    }

    if (isError) {
        return <NetworkErrorContainer onRetry={retry} />;
    }

    return (
        <BottomSheetSectionList
            className="flex-1"
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
