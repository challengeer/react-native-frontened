import React, { useCallback, useMemo } from "react";
import { SectionList, ActivityIndicator } from "react-native";
import { getSectionTitle } from "@/utils/timeUtils";
import { useHistory } from "@/hooks/useHistory";
import { Challenge } from "@/types/challenge";
import Text from "@/components/common/Text";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import ChallengeRightSection from "@/components/challenges/ChallengeRightSection";

interface Section {
    title: string | null;
    data: Challenge[];
}

export default function HistoryList({ search }: { search: string }) {
    const { history, isHistoryLoading, isHistoryError, refetchHistory } = useHistory();

    const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
        if (section.data.length === 0 || section.title === null) return null;
        return (
            <Text 
                className="px-4 pt-4 pb-2 capitalize text-lg font-bold bg-white dark:bg-neutral-900"
            >
                {section.title}
            </Text>
        );
    }, []);

    const renderItem = useCallback(({ item, index }: { item: Challenge, index: number }) => (
        <ChallengeItem
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

    const keyExtractor = useCallback((item: Challenge) => `challenge-${item.challenge_id}`, []);

    const sections: Section[] = useMemo(() => {
        if (!history) return [];

        const filteredHistory = history.filter((challenge: Challenge) =>
            challenge.title.toLowerCase().includes(search.toLowerCase()) ||
            challenge.category.toLowerCase().includes(search.toLowerCase())
        );

        // Group challenges by date
        const groupedChallenges: Record<string, Challenge[]> = filteredHistory.reduce((acc: Record<string, Challenge[]>, challenge: Challenge) => {
            const sectionTitle = getSectionTitle(challenge.created_at);
            
            if (!acc[sectionTitle]) {
                acc[sectionTitle] = [];
            }
            acc[sectionTitle].push(challenge);
            return acc;
        }, {});

        // Convert to array of sections and sort by date
        return Object.entries(groupedChallenges)
            .map(([title, data]) => ({
                title,
                data: data.sort((a, b) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
            }))
            .sort((a, b) => {
                const dateA = new Date(a.data[0].created_at);
                const dateB = new Date(b.data[0].created_at);
                return dateB.getTime() - dateA.getTime();
            });
    }, [history, search]);

    if (isHistoryLoading) {
        return <ActivityIndicator className="flex-1 items-center justify-center" size="large" color="#a855f7" />;
    }

    if (isHistoryError) {
        return <NetworkErrorContainer onRetry={refetchHistory} />;
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
            keyboardShouldPersistTaps="handled"
        />
    );
} 