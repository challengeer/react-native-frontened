import i18n from "@/i18n";
import { View, Dimensions, useWindowDimensions, FlatList } from "react-native";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { useState, useRef, useCallback } from "react";
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
    const { width: windowWidth } = useWindowDimensions();
    const width = windowWidth - 16;
    const daySize = (width - 8) / 7;
    const weekHeight = daySize;
    const maxWeeks = 7;
    const calendarHeight = (weekHeight * maxWeeks) + 32;
    const flatListRef = useRef<FlatList>(null);

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
            <View style={{ width, height: calendarHeight }} className="pl-4">
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

    const formatMonthYear = (date: Date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${currentTranslation.months[month]} ${year}`;
    };

    const isSelected = (day: number | null, monthDate: Date) => {
        if (!day) return false;
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const currentDateStr = localDate.toISOString().split('T')[0];
        return selectedDates.some(date => date.split('T')[0] === currentDateStr);
    };

    const generateMonths = useCallback((startDate: Date, count: number) => {
        const months = [];
        for (let i = 0; i < count; i++) {
            months.push(getAdjacentMonth(startDate, -i));
        }
        return months;
    }, []);

    const [months, setMonths] = useState(() => generateMonths(currentDate, 12));

    const handleScroll = useCallback(({ nativeEvent }: any) => {
        const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
        const currentIndex = Math.floor(contentOffset.x / width);

        if (currentIndex >= months.length - 3) {
            // Load more months when approaching the end (which is now the past)
            const newMonths = generateMonths(months[months.length - 1], 12);
            setMonths(prev => [...prev, ...newMonths]);
        }
    }, [months, width, generateMonths]);

    const handleMonthChange = useCallback((date: Date) => {
        setCurrentDate(date);
        onMonthChange?.(date);
    }, [onMonthChange]);

    const handleMomentumScrollEnd = useCallback(({ nativeEvent }: any) => {
        const { contentOffset } = nativeEvent;
        const currentIndex = Math.round(contentOffset.x / width);
        handleMonthChange(months[currentIndex]);
    }, [width, months, handleMonthChange]);

    const handleChevronPress = useCallback((direction: 'left' | 'right') => {
        const currentIndex = months.findIndex(date => 
            date.getMonth() === currentDate.getMonth() && 
            date.getFullYear() === currentDate.getFullYear()
        );
        
        if (currentIndex === -1) return;
        
        const targetIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex >= 0 && targetIndex < months.length) {
            flatListRef.current?.scrollToIndex({
                index: targetIndex,
                animated: true
            });
            handleMonthChange(months[targetIndex]);
        }
    }, [months, currentDate, handleMonthChange]);

    const renderItem = useCallback(({ item: date }: { item: Date }) => (
        <View style={{ width }}>
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-medium pl-4">{formatMonthYear(date)}</Text>
                <View className="flex-row gap-2">
                    <IconCircle icon={ChevronLeftIcon} onPress={() => handleChevronPress('left')} />
                    <IconCircle icon={ChevronRightIcon} onPress={() => handleChevronPress('right')} />
                </View>
            </View>
            {renderMonth(date)}
        </View>
    ), [width, formatMonthYear, renderMonth, handleChevronPress]);

    return (
        <View className="mt-2">
            <FlatList
                ref={flatListRef}
                data={months}
                renderItem={renderItem}
                keyExtractor={(item) => item.toISOString()}
                horizontal
                inverted
                pagingEnabled
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={0}
                initialScrollIndex={0}
                contentContainerStyle={{ alignItems: 'center' }}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                key={months.length}
            />
        </View>
    );
}