import i18n from "@/i18n";
import React, { useCallback, useMemo } from "react";
import { SectionList, ActivityIndicator, View } from "react-native";
import { useHistory } from "@/hooks/useHistory";
import Text from "@/components/common/Text";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import { getSectionTitle, getTimeString } from "@/utils/timeUtils";

interface Challenge {
    challenge_id: string;
    title: string;
    description: string;
    created_at: string;
    status: string;
}

interface Section {
    title: string | null;
    data: Challenge[];
}

export default function HistoryList() {
    const { history, isHistoryLoading, isHistoryError, refetchHistory } = useHistory();

    const renderSectionHeader = useCallback(({ section }: { section: Section }) => {
        if (section.data.length === 0 || section.title === null) return null;
        return <Text className="px-4 pt-4 pb-2 text-lg font-bold bg-white dark:bg-neutral-900">{section.title}</Text>;
    }, []);

    const renderItem = useCallback(({ item }: { item: Challenge }) => (
        <View className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</Text>
            <View className="flex-row justify-between items-center mt-2">
                <Text className="text-sm text-gray-500 dark:text-gray-500">
                    {getTimeString(new Date(item.created_at))}
                </Text>
                <Text className={`text-sm font-medium ${
                    item.status === 'completed' ? 'text-green-500' : 
                    item.status === 'failed' ? 'text-red-500' : 
                    'text-yellow-500'
                }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
            </View>
        </View>
    ), []);

    const keyExtractor = useCallback((item: Challenge) => `challenge-${item.challenge_id}`, []);

    const sections: Section[] = useMemo(() => {
        if (!history) return [];

        // Group challenges by date
        const groupedChallenges: Record<string, Challenge[]> = history.reduce((acc: Record<string, Challenge[]>, challenge: Challenge) => {
            const date = new Date(challenge.created_at);
            const sectionTitle = getSectionTitle(date);
            
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
    }, [history]);

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
        />
    );
} 