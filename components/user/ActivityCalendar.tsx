import i18n from "@/i18n";
import { View, Dimensions, useWindowDimensions, FlatList } from "react-native";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { useState, useRef, useCallback, useMemo, memo } from "react";
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

const MonthView = memo(({ date, width, calendarHeight, currentTranslation, isSelected, todayDate, isCurrentMonth, getDaysInMonth }: {
    date: Date;
    width: number;
    calendarHeight: number;
    currentTranslation: typeof TRANSLATIONS.en;
    isSelected: (day: number | null, monthDate: Date) => boolean;
    todayDate: number | null;
    isCurrentMonth: boolean;
    getDaysInMonth: (date: Date) => (number | null)[][];
}) => {
    const weeks = useMemo(() => getDaysInMonth(date), [date]);

    // Ensure we always have 7 weeks
    const paddedWeeks = useMemo(() => {
        const result = [...weeks];
        while (result.length < 7) {
            result.push(Array(7).fill(null));
        }
        return result;
    }, [weeks]);

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
                        {week.map((day: number | null, dayIndex: number) => {
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
});

const MonthHeader = memo(({ date, currentTranslation, onChevronPress }: {
    date: Date;
    currentTranslation: typeof TRANSLATIONS.en;
    onChevronPress: (direction: 'left' | 'right') => void;
}) => {
    const formatMonthYear = useCallback((date: Date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${currentTranslation.months[month]} ${year}`;
    }, [currentTranslation]);

    return (
        <View className="flex-row justify-between items-center mb-4">
            <Text className="font-medium pl-4">{formatMonthYear(date)}</Text>
            <View className="flex-row gap-2">
                <IconCircle icon={ChevronLeftIcon} onPress={() => onChevronPress('left')} />
                <IconCircle icon={ChevronRightIcon} onPress={() => onChevronPress('right')} />
            </View>
        </View>
    );
});

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
        const currentDate = new Date(startDate);
        for (let i = 0; i < count; i++) {
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() - i);
            months.push(newDate);
        }
        return months;
    }, []);

    const [months, setMonths] = useState(() => generateMonths(currentDate, 12));

    const handleScroll = useCallback(({ nativeEvent }: any) => {
        const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
        const currentIndex = Math.floor(contentOffset.x / width);

        // Only load more months when we're close to the end
        if (currentIndex >= months.length - 3) {
            const lastMonth = months[months.length - 1];
            const newMonths = generateMonths(lastMonth, 12);
            
            // Filter out any duplicate months
            const uniqueNewMonths = newMonths.filter(newMonth => 
                !months.some(existingMonth => 
                    existingMonth.getMonth() === newMonth.getMonth() && 
                    existingMonth.getFullYear() === newMonth.getFullYear()
                )
            );
            
            setMonths(prev => [...prev, ...uniqueNewMonths]);
        }
    }, [months, width, generateMonths]);

    const handleMonthChange = useCallback((date: Date) => {
        setCurrentDate(date);
        onMonthChange?.(date);
    }, [onMonthChange]);

    const handleMomentumScrollEnd = useCallback(({ nativeEvent }: any) => {
        const { contentOffset } = nativeEvent;
        const currentIndex = Math.round(contentOffset.x / width);
        
        // Ensure the index is within bounds and handle the inverted list
        if (currentIndex >= 0 && currentIndex < months.length) {
            const targetDate = months[currentIndex];
            // Only update if the month/year is different to prevent unnecessary updates
            if (targetDate.getMonth() !== currentDate.getMonth() || 
                targetDate.getFullYear() !== currentDate.getFullYear()) {
                handleMonthChange(targetDate);
            }
        }
    }, [width, months, currentDate, handleMonthChange]);

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
                animated: true,
                viewPosition: 0.5
            });
            handleMonthChange(months[targetIndex]);
        }
    }, [months, currentDate, handleMonthChange]);

    const renderItem = useCallback(({ item: date }: { item: Date }) => {
        const today = new Date();
        const isCurrentMonth = today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
        const todayDate = isCurrentMonth ? today.getDate() : null;

        return (
            <View style={{ width }}>
                <MonthHeader 
                    date={date} 
                    currentTranslation={currentTranslation} 
                    onChevronPress={handleChevronPress} 
                />
                <MonthView 
                    date={date}
                    width={width}
                    calendarHeight={calendarHeight}
                    currentTranslation={currentTranslation}
                    isSelected={isSelected}
                    todayDate={todayDate}
                    isCurrentMonth={isCurrentMonth}
                    getDaysInMonth={getDaysInMonth}
                />
            </View>
        );
    }, [width, calendarHeight, currentTranslation, isSelected, handleChevronPress]);

    const getItemLayout = useCallback((data: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    }), [width]);

    const keyExtractor = useCallback((item: Date, index: number) => 
        `${item.getFullYear()}-${item.getMonth()}-${index}`, 
    []);

    return (
        <View className="mt-2">
            <FlatList
                ref={flatListRef}
                data={months}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                inverted
                pagingEnabled
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                initialScrollIndex={0}
                contentContainerStyle={{ alignItems: 'center' }}
                getItemLayout={getItemLayout}
                maxToRenderPerBatch={3}
                windowSize={3}
                removeClippedSubviews={true}
                snapToAlignment="center"
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 10
                }}
            />
        </View>
    );
}