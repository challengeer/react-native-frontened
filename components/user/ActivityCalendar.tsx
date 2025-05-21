import i18n from "@/i18n";
import { View, PanResponder, Animated, ScrollView, Dimensions, useWindowDimensions } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { useState, useRef } from "react";
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
    const scrollViewRef = useRef<ScrollView>(null);
    const { width: windowWidth } = useWindowDimensions();
    const width = windowWidth - 32;

    const getAdjacentMonth = (date: Date, offset: number) => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + offset);
        return newDate;
    };

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

    const renderMonth = (date: Date) => {
        const weeks = getDaysInMonth(date);
        return (
            <View style={{ width }}>
                <View className="mb-2 flex-row justify-between">
                    {currentTranslation.weekdays.map(day => (
                        <View key={day} className="flex-1 items-center">
                            <Text className="text-sm text-neutral-500">{day}</Text>
                        </View>
                    ))}
                </View>

                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} className="flex-row justify-between">
                        {week.map((day, dayIndex) => (
                            <View
                                key={dayIndex}
                                className={`aspect-square flex-1 m-0.5 rounded-lg items-center justify-center relative
                                    ${isSelected(day) ? 'bg-primary-500' : 'bg-neutral-100 dark:bg-neutral-800'}
                                    ${day === null ? 'opacity-0' : ''}`}
                            >
                                {isToday(day) && (
                                    <View className="absolute -inset-1 rounded-xl border-2 border-primary-600" />
                                )}
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
    };

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const page = Math.round(offsetX / width);
        
        if (page === 1) {
            // We're on the current month, do nothing
            return;
        }

        if (page === 0) {
            // Scrolled to previous month
            setCurrentDate(getAdjacentMonth(currentDate, -1));
            onMonthChange?.(getAdjacentMonth(currentDate, -1));
            scrollViewRef.current?.scrollTo({ x: width, animated: false });
        } else if (page === 2) {
            // Scrolled to next month
            setCurrentDate(getAdjacentMonth(currentDate, 1));
            onMonthChange?.(getAdjacentMonth(currentDate, 1));
            scrollViewRef.current?.scrollTo({ x: width, animated: false });
        }
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

    return (
        <View className="mt-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-medium">{formatMonthYear(currentDate)}</Text>
                <View className="flex-row gap-3">
                    <IconCircle icon={ChevronLeftIcon} onPress={() => {
                        setCurrentDate(getAdjacentMonth(currentDate, -1));
                        onMonthChange?.(getAdjacentMonth(currentDate, -1));
                        scrollViewRef.current?.scrollTo({ x: width, animated: true });
                    }} />
                    <IconCircle icon={ChevronRightIcon} onPress={() => {
                        setCurrentDate(getAdjacentMonth(currentDate, 1));
                        onMonthChange?.(getAdjacentMonth(currentDate, 1));
                        scrollViewRef.current?.scrollTo({ x: width, animated: true });
                    }} />
                </View>
            </View>

            <View>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    scrollEventThrottle={16}
                >
                    {renderMonth(getAdjacentMonth(currentDate, -1))}
                    {renderMonth(currentDate)}
                    {renderMonth(getAdjacentMonth(currentDate, 1))}
                </ScrollView>
            </View>
        </View>
    );
}