import { View } from "react-native";
import Text from "@/components/common/Text";
import { memo, useMemo } from "react";
import WeekRow from "./WeekRow";

interface MonthViewProps {
    date: Date;
    width: number;
    calendarHeight: number;
    currentTranslation: {
        weekdays: string[];
    };
    isSelected: (day: number | null, monthDate: Date) => boolean;
    todayDate: number | null;
    isCurrentMonth: boolean;
    getDaysInMonth: (date: Date) => (number | null)[][];
}

const MonthView = memo(({
    date,
    width,
    calendarHeight,
    currentTranslation,
    isSelected,
    todayDate,
    isCurrentMonth,
    getDaysInMonth
}: MonthViewProps) => {
    const weeks = useMemo(() => getDaysInMonth(date), [date, getDaysInMonth]);

    // Ensure we always have 7 weeks
    const paddedWeeks = useMemo(() => {
        const result = [...weeks];
        while (result.length < 7) {
            result.push(Array(7).fill(null));
        }
        return result;
    }, [weeks]);

    return (
        <View style={{ width, height: calendarHeight }}>
            <View className="mb-2 flex-row justify-between">
                {currentTranslation.weekdays.map(day => (
                    <View key={day} className="flex-1 items-center">
                        <Text className="text-sm text-neutral-500">{day}</Text>
                    </View>
                ))}
            </View>

            <View style={{ flex: 1 }}>
                {paddedWeeks.map((week, weekIndex) => (
                    <WeekRow
                        key={weekIndex}
                        week={week}
                        date={date}
                        isSelected={isSelected}
                        isCurrentMonth={isCurrentMonth}
                        todayDate={todayDate}
                    />
                ))}
            </View>
        </View>
    );
});

export default MonthView; 