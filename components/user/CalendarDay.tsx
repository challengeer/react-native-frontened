import { View } from "react-native";
import Text from "@/components/common/Text";
import { memo } from "react";

interface CalendarDayProps {
    day: number | null;
    isSelected: boolean;
    isToday: boolean;
}

const CalendarDay = memo(({ day, isSelected, isToday }: CalendarDayProps) => (
    <View
        className={`aspect-square flex-1 m-0.5 rounded-lg items-center justify-center relative
            ${isSelected ? 'bg-primary-500' : 'bg-neutral-100 dark:bg-neutral-800'}
            ${day === null ? 'opacity-0' : ''}`}
    >
        {isToday && (
            <View className="absolute -inset-1 rounded-xl border-2 border-primary-600" />
        )}
        {day !== null && (
            <Text
                className={`text-base ${isSelected ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}
                style={{ opacity: day === null ? 0 : 1 }}
            >
                {day}
            </Text>
        )}
    </View>
));

export default CalendarDay; 