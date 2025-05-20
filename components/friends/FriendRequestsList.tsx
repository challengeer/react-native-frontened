import React, { useCallback, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { Section } from "@/utils/userSections";
import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import UserItem from "@/components/common/UserItem";
import Text from "@/components/common/Text";
import { User, FriendRequest } from "@/types/user";
import FriendActionButton from "@/components/friends/FriendActionButton";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import i18n from "@/i18n";
import { useFriendsList } from "@/hooks/useFriendsList";
import { ContactRecommendation } from "@/types/contact";

const UserItemMemo = React.memo(UserItem);

export default function FriendRequestsList({ search }: { search: string }) {
    const { sections, isLoading, isError, refetch } = useFriendsList(search);

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

    const renderItem = useCallback(({ item, index, section }: { item: FriendRequest | ContactRecommendation | User, index: number, section: Section }) => {
        if ("request_id" in item) {
            return renderFriendRequest({ item: item as FriendRequest, index, section });
        } else if ("contact_id" in item) {
            return renderContact({ item: item as ContactRecommendation, index });
        } else {
            return renderRecommendation({ item: item as User, index });
        }
    }, [renderFriendRequest, renderContact, renderRecommendation]);

    const keyExtractor = useCallback((item: FriendRequest | ContactRecommendation | User) => {
        if ("request_id" in item) {
            return `friend-request-${(item as FriendRequest).user_id}`;
        } else if ("contact_id" in item) {
            return `contact-${(item as ContactRecommendation).contact_id}`;
        } else {
            return `recommended-${(item as User).user_id}`;
        }
    }, []);

    if (isLoading) {
        return <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />;
    }

    if (isError) {
        return <NetworkErrorContainer onRetry={refetch} />;
    }

    if (sections.length === 0) {
        return <Text type="secondary" className="text-center text-lg pt-16">{i18n.t("friends.search.noResults", { search })}</Text>;
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
            initialNumToRender={10}
            windowSize={5}
            removeClippedSubviews={true}
            stickySectionHeadersEnabled={true}
            contentContainerClassName="pb-48"
        />
    );
}
