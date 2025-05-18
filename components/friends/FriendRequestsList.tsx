import i18n from "@/i18n";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { ContactRecommendation, useContacts } from "@/hooks/useContacts";
import { FriendRequest, Friend, useFriends } from "@/hooks/useFriends";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import UserItem from "@/components/common/UserItem";
import Text from "@/components/common/Text";
import UserInterface from "@/types/UserInterface";
import FriendActionButton from "@/components/friends/FriendActionButton";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";

interface Section {
    title: string;
    data: (FriendRequest | Friend | ContactRecommendation | UserInterface)[];
}

const UserItemMemo = React.memo(UserItem);

export default function FriendRequestsList({ search }: { search: string }) {
    const { friendRequestsReceived, isFriendRequestsReceivedLoading, isFriendRequestsReceivedError, refetchFriendRequestsReceived } = useFriends();
    const { friendRequestsSent, isFriendRequestsSentLoading, isFriendRequestsSentError, refetchFriendRequestsSent } = useFriends();
    const { contacts, recommendations, isContactsLoading, isRecommendationsLoading, isContactsError, isRecommendationsError, refetchContacts, refetchRecommendations } = useContacts();

    const filteredFriendRequestsReceived = useMemo(() => {
        return friendRequestsReceived?.filter((request) =>
            request.display_name.toLowerCase().includes(search.toLowerCase()) ||
            request.username.toLowerCase().includes(search.toLowerCase())
        );
    }, [friendRequestsReceived, search]);

    const filteredFriendRequestsSent = useMemo(() => {
        return friendRequestsSent?.filter((request) =>
            request.display_name.toLowerCase().includes(search.toLowerCase()) ||
            request.username.toLowerCase().includes(search.toLowerCase())
        );
    }, [friendRequestsSent, search]);

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

    const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
        if (section.data.length === 0) return null;
        return <Text className="px-4 pt-3 pb-2 text-lg font-bold bg-white dark:bg-neutral-900">{section.title}</Text>;
    }, []);

    const renderFriendRequest = useCallback(({ item, index, section }: { item: FriendRequest, index: number, section: Section }) => {
        const isReceivedRequest = section.title === i18n.t("friends.requests.received");
        
        return (
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
                        requestId={item.request_id}
                        friendshipStatus={isReceivedRequest ? "request_received" : "request_sent"}
                    />
                }
            />
        );
    }, []);

    const renderContact = useCallback(({ item, index }: { item: ContactRecommendation, index: number }) => (
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

    const renderItem = useCallback(({ item, index, section }: { item: FriendRequest | ContactRecommendation | UserInterface, index: number, section: Section }) => {
        if ("request_id" in item) {
            return renderFriendRequest({ item: item as FriendRequest, index, section });
        } else if ("contact_id" in item) {
            return renderContact({ item: item as ContactRecommendation, index });
        } else {
            return renderRecommendation({ item: item as UserInterface, index });
        }
    }, [renderFriendRequest, renderContact, renderRecommendation]);

    const keyExtractor = useCallback((item: FriendRequest | ContactRecommendation | UserInterface) => {
        if ("request_id" in item) {
            return `friend-request-${(item as FriendRequest).user_id}`;
        } else if ("contact_id" in item) {
            return `contact-${(item as ContactRecommendation).contact_id}`;
        } else {
            return `recommended-${(item as UserInterface).user_id}`;
        }
    }, []);

    const sections: Section[] = useMemo(() => [
        {
            title: i18n.t("friends.requests.received"),
            data: filteredFriendRequestsReceived || [],
        },
        {
            title: i18n.t("friends.requests.sent"),
            data: filteredFriendRequestsSent || [],
        },
        {
            title: i18n.t("friends.recommendations"),
            data: filteredRecommendations || [],
        },
        {
            title: i18n.t("friends.contacts"),
            data: filteredContacts || [],
        },
    ], [filteredFriendRequestsReceived, filteredFriendRequestsSent, filteredRecommendations, filteredContacts]);

    const isLoading = isFriendRequestsReceivedLoading || isFriendRequestsSentLoading || isContactsLoading || isRecommendationsLoading;
    const isError = isFriendRequestsReceivedError || isFriendRequestsSentError || isContactsError || isRecommendationsError;

    const retry = useCallback(() => {
        refetchFriendRequestsReceived();
        refetchFriendRequestsSent();
        refetchRecommendations();
        refetchContacts();
    }, [refetchFriendRequestsReceived, refetchFriendRequestsSent, refetchRecommendations, refetchContacts]);

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
            stickySectionHeadersEnabled={true}
            contentContainerClassName="pb-48"
        />
    );
}
