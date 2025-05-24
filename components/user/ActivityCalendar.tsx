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
    const [isScrolling, setIsScrolling] = useState(false);
    const currentTranslation = TRANSLATIONS[i18n.locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
    const scrollViewRef = useRef<ScrollView>(null);
    const { width: windowWidth } = useWindowDimensions();
    const width = windowWidth - 24;
    const daySize = (width - 8) / 7;
    const weekHeight = daySize;
    const maxWeeks = 7;
    const calendarHeight = (weekHeight * maxWeeks) + 24;

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
        const today = new Date();
        const isCurrentMonth = today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
        const todayDate = isCurrentMonth ? today.getDate() : null;

        // Ensure we always have 7 weeks
        const paddedWeeks = [...weeks];
        while (paddedWeeks.length < 7) {
            paddedWeeks.push(Array(7).fill(null));
        }

        return (
            <View style={{ width, height: calendarHeight }} className="px-1">
                <View className="mb-2 flex-row justify-between">
                    {currentTranslation.weekdays.map(day => (
                        <View key={day} className="flex-1 items-center">
                            <Text className="text-sm text-neutral-500">{day}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ flex: 1 }}>
                    {paddedWeeks.map((week, weekIndex) => (
                        <View key={weekIndex} className="flex-row justify-between">
                            {week.map((day, dayIndex) => {
                                const isDaySelected = isSelected(day, date);
                                const isDayToday = isCurrentMonth && day === todayDate;
                                
                                return (
                                    <View
                                        key={dayIndex}
                                        className={`aspect-square flex-1 m-0.5 rounded-lg items-center justify-center relative
                                            ${isDaySelected ? 'bg-primary-500' : 'bg-neutral-100 dark:bg-neutral-800'}
                                            ${day === null ? 'opacity-0' : ''}`}
                                    >
                                        {isDayToday && (
                                            <View className="absolute -inset-1 rounded-xl border-2 border-primary-600" />
                                        )}
                                        {day !== null && (
                                            <Text 
                                                className={`text-base ${isDaySelected ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}
                                                style={{ opacity: day === null ? 0 : 1 }}
                                            >
                                                {day}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const page = Math.round(offsetX / width);
        
        if (page === 2 || isScrolling) return;

        if (page === 0 || page === 1) {
            setIsScrolling(true);
            const newDate = getAdjacentMonth(currentDate, -1);
            setCurrentDate(newDate);
            onMonthChange?.(newDate);
            requestAnimationFrame(() => {
                scrollViewRef.current?.scrollTo({ x: width * 2, animated: false });
                setIsScrolling(false);
            });
        } else if (page === 3 || page === 4) {
            setIsScrolling(true);
            const newDate = getAdjacentMonth(currentDate, 1);
            setCurrentDate(newDate);
            onMonthChange?.(newDate);
            requestAnimationFrame(() => {
                scrollViewRef.current?.scrollTo({ x: width * 2, animated: false });
                setIsScrolling(false);
            });
        }
    };

    const formatMonthYear = (date: Date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${currentTranslation.months[month]} ${year}`;
    };

    const isSelected = (day: number | null, monthDate: Date) => {
        if (!day) return false;
        // Create date at midnight in local timezone
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        // Adjust for local timezone offset
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const currentDateStr = localDate.toISOString().split('T')[0];
        return selectedDates.some(date => date.split('T')[0] === currentDateStr);
    };

    const isToday = (day: number | null, monthDate: Date) => {
        if (!day) return false;
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === monthDate.getMonth() &&
            today.getFullYear() === monthDate.getFullYear()
        );
    };

    return (
        <View className="mt-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-medium">{formatMonthYear(currentDate)}</Text>
                <View className="flex-row gap-3">
                    <IconCircle icon={ChevronLeftIcon} onPress={() => {
                        if (isScrolling) return;
                        setIsScrolling(true);
                        const newDate = getAdjacentMonth(currentDate, -1);
                        setCurrentDate(newDate);
                        onMonthChange?.(newDate);
                        scrollViewRef.current?.scrollTo({ x: width * 2, animated: true });
                        setTimeout(() => setIsScrolling(false), 300);
                    }} />
                    <IconCircle icon={ChevronRightIcon} onPress={() => {
                        if (isScrolling) return;
                        setIsScrolling(true);
                        const newDate = getAdjacentMonth(currentDate, 1);
                        setCurrentDate(newDate);
                        onMonthChange?.(newDate);
                        scrollViewRef.current?.scrollTo({ x: width * 2, animated: true });
                        setTimeout(() => setIsScrolling(false), 300);
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
                    decelerationRate="fast"
                    style={{ width }}
                    onLayout={() => {
                        scrollViewRef.current?.scrollTo({ x: width * 2, animated: false });
                    }}
                >
                    <View style={{ width: width * 5, flexDirection: 'row' }}>
                        <View style={{ width }}>
                            {renderMonth(getAdjacentMonth(currentDate, -2))}
                        </View>
                        <View style={{ width }}>
                            {renderMonth(getAdjacentMonth(currentDate, -1))}
                        </View>
                        <View style={{ width }}>
                            {renderMonth(currentDate)}
                        </View>
                        <View style={{ width }}>
                            {renderMonth(getAdjacentMonth(currentDate, 1))}
                        </View>
                        <View style={{ width }}>
                            {renderMonth(getAdjacentMonth(currentDate, 2))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}