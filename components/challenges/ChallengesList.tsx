import i18n from "@/i18n";
import React, { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import { SectionList, ActivityIndicator, RefreshControl, View } from "react-native";
import { Challenge, ChallengeInvite } from "@/types/challenge";
import { useChallenges } from "@/hooks/useChallenges";
import { useFriends } from "@/hooks/useFriends";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import ChallengeInviteRightSection from "@/components/challenges/ChallengeInviteRightSection";
import ChallengeRightSection from "@/components/challenges/ChallengeRightSection";

interface Section {
    title: string | null;
    data: (Challenge | ChallengeInvite)[];
}

const ChallengeItemMemo = React.memo(ChallengeItem);

export default function ChallengesList() {
    const { challenges, isChallengesLoading, isChallengesError, refetchChallenges, challengeInvites, isChallengeInvitesLoading, isChallengeInvitesError, refetchChallengeInvites } = useChallenges();
    const [refreshing, setRefreshing] = useState(false);
    const { friends } = useFriends();

    const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
        if (section.data.length === 0 || section.title === null) return null;
        return (
            <Text className="px-4 pt-4 pb-2 text-lg font-bold bg-white dark:bg-neutral-900">
                {section.title}
            </Text>
        );
    }, []);

    const renderChallenge = useCallback(({ item, index }: { item: Challenge, index: number }) => (
        <ChallengeItemMemo
            key={item.challenge_id}
            index={index}
            challengeId={item.challenge_id}
            title={item.title}
            emoji={item.emoji}
            category={item.category}
            endDate={item.end_date}
            hasNewSubmissions={item.has_new_submissions}
            rightSection={
                <ChallengeRightSection
                    challengeId={item.challenge_id}
                    completionStatus={item.completion_status}
                />
            }
        />
    ), []);

    const renderChallengeInvite = useCallback(({ item, index }: { item: ChallengeInvite, index: number }) => (
        <ChallengeItemMemo
            key={item.challenge_id}
            index={index}
            challengeId={item.challenge_id}
            title={item.title}
            emoji={item.emoji}
            category={item.category}
            endDate={item.end_date}
            hasNewSubmissions={item.has_new_submissions}
            sender={item.sender}
            rightSection={
                <ChallengeInviteRightSection
                    invitationId={item.invitation_id}
                />
            }
        />
    ), []);

    const renderItem = useCallback(({ item, index }: { item: Challenge | ChallengeInvite, index: number }) => {
        if ('sender' in item) {
            return renderChallengeInvite({ item, index });
        } else {
            return renderChallenge({ item, index });
        }
    }, [renderChallenge, renderChallengeInvite]);

    const keyExtractor = useCallback((item: Challenge) => `challenge-${item.challenge_id}`, []);

    const sections = useMemo(() => {
        return [
            { title: null, data: challenges || [] },
            { title: i18n.t("challenges.invitations.title"), data: challengeInvites || [] },
        ];
    }, [challenges, challengeInvites]);
    
    const isLoading = isChallengesLoading || isChallengeInvitesLoading;
    const isError = isChallengesError || isChallengeInvitesError;

    const refetch = useCallback(async () => {
        await Promise.all([refetchChallenges(), refetchChallengeInvites()]);
    }, [refetchChallenges, refetchChallengeInvites]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    if (isLoading) {
        return <ActivityIndicator className="flex-1 items-center justify-center" size="large" color="#a855f7" />;
    }

    if (isError) {
        return <NetworkErrorContainer onRetry={refetch} />;
    }

    if (friends?.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-center text-xl font-bold mb-4">{i18n.t("challenges.noFriends.title")}</Text>
                <Text type="secondary" className="text-center text-lg mb-16">{i18n.t("challenges.noFriends.description")}</Text>
                <Button
                    title={i18n.t("challenges.noFriends.button")}
                    onPress={() => router.push("/add_friends")}
                />
            </View>
        );
    }

    if (sections.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-center text-xl font-bold mb-4">{i18n.t("challenges.noChallenges.title")}</Text>
                <Text type="secondary" className="text-center text-lg mb-16">{i18n.t("challenges.noChallenges.description")}</Text>
                <Button
                    title={i18n.t("challenges.noChallenges.button")}
                    onPress={() => router.push("/create_challenge")}
                />
            </View>
        );
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
            stickySectionHeadersEnabled={true}
            contentContainerClassName="pb-48"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        />
    );
} 