import { View } from "react-native";
import Text from "@/components/common/Text";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import i18n from "@/i18n";
import IconCircle from "../common/IconCircle";

interface ActivityCalendarProps {
    selectedDates?: string[];
    onMonthChange?: (month: Date) => void;
}

const TRANSLATIONS = {
    en: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    sk: {
        months: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
        weekdays: ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne']
    }
};

export default function ActivityCalendar({ selectedDates = [], onMonthChange }: ActivityCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentTranslation = TRANSLATIONS[i18n.locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;

        const daysInMonth = lastDay.getDate();
        const weeks: (number | null)[][] = [];
        let currentWeek: (number | null)[] = [];

        for (let i = 1; i < firstDayOfWeek; i++) {
            currentWeek.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        }

        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);

        return weeks;
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate);
        onMonthChange?.(newDate);
    };

    const formatMonthYear = (date: Date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${currentTranslation.months[month]} ${year}`;
    };

    const isSelected = (day: number | null) => {
        if (!day) return false;
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return selectedDates.includes(dateStr);
    };

    const weeks = getDaysInMonth(currentDate);

    return (
        <View className="mt-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-medium">{formatMonthYear(currentDate)}</Text>
                <View className="flex-row gap-3">
                    <IconCircle icon={ChevronLeftIcon} onPress={() => changeMonth(-1)} />
                    <IconCircle icon={ChevronRightIcon} onPress={() => changeMonth(1)} />
                </View>
            </View>

            <View className="mb-2 flex-row justify-between">
                {currentTranslation.weekdays.map(day => (
                    <View key={day} className="w-9 items-center">
                        <Text className="text-base text-neutral-500">{day}</Text>
                    </View>
                ))}
            </View>

            {weeks.map((week, weekIndex) => (
                <View key={weekIndex} className="flex-row justify-between mb-2 gap-2">
                    {week.map((day, dayIndex) => (
                        <View
                            key={dayIndex}
                            className={`aspect-square flex-1 rounded-lg items-center justify-center
                                ${isSelected(day) ? 'bg-purple-500' : 'bg-neutral-100 dark:bg-neutral-800'}
                                ${day === null ? 'opacity-0' : ''}`}
                        >
                            {day !== null && (
                                <Text className={`text-base ${isSelected(day) ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                    {day}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}