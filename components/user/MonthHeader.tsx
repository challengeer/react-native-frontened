import { View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import Text from "@/components/common/Text";
import IconCircle from "@/components/common/IconCircle";
import { memo, useCallback } from "react";

interface MonthHeaderProps {
    date: Date;
    currentTranslation: {
        months: string[];
    };
    onChevronPress: (direction: 'left' | 'right') => void;
}

const MonthHeader = memo(({ date, currentTranslation, onChevronPress }: MonthHeaderProps) => {
    const formatMonthYear = useCallback((date: Date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${currentTranslation.months[month]} ${year}`;
    }, [currentTranslation]);

    return (
        <View className="flex-row justify-between items-center mb-4">
            <Text className="font-medium">{formatMonthYear(date)}</Text>
            <View className="flex-row gap-2">
                <IconCircle icon={ChevronLeftIcon} onPress={() => onChevronPress('left')} />
                <IconCircle icon={ChevronRightIcon} onPress={() => onChevronPress('right')} />
            </View>
        </View>
    );
});

export default MonthHeader; 