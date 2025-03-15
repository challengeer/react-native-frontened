import i18n from "@/i18n";
import { View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { useState } from "react";
import Text from "@/components/common/Text";
import IconCircle from "@/components/common/IconCircle";

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

    console.log(selectedDates);

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
        // Create date at midnight in local timezone
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Adjust for local timezone offset
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const currentDateStr = localDate.toISOString().split('T')[0];
        return selectedDates.some(date => date.split('T')[0] === currentDateStr);
    };

    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        );
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
                            className={`aspect-square flex-1 rounded-lg items-center justify-center relative
                                ${isSelected(day) ? 'bg-primary-500' : 'bg-neutral-100 dark:bg-neutral-800'}
                                ${day === null ? 'opacity-0' : ''}`}
                        >
                            {isToday(day) && (
                                <View className="absolute -inset-1 rounded-xl border-2 border-primary-600" />
                            )}
                            {day !== null && (
                                <Text className={`text-lg ${isSelected(day) ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
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