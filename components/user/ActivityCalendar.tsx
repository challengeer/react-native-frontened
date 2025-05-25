import i18n from "@/i18n";
import { View, useWindowDimensions, FlatList } from "react-native";
import { useState, useRef, useCallback, useEffect } from "react";
import MonthHeader from "./MonthHeader";
import MonthView from "./MonthView";

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

    const isSelected = (day: number | null, monthDate: Date) => {
        if (!day) return false;
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const currentDateStr = localDate.toISOString().split('T')[0];
        return selectedDates.some(date => date.split('T')[0] === currentDateStr);
    };

    const generateMonthsRange = (centerDate: Date, past: number, future: number) => {
        const months: Date[] = [];
        for (let i = -past; i <= future; i++) {
            const date = new Date(centerDate);
            date.setMonth(date.getMonth() + i);
            months.push(new Date(date));
        }
        return months;
    };

    const [months, setMonths] = useState(() => generateMonthsRange(currentDate, 12, 12));

    const handleScroll = useCallback(({ nativeEvent }: any) => {
        const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
        const currentIndex = Math.floor(contentOffset.x / width);

        if (currentIndex >= months.length - 3) {
            const lastMonth = months[months.length - 1];
            const newMonths = generateMonthsRange(lastMonth, 12, 12);
            
            const uniqueNewMonths = newMonths.filter(newMonth => 
                !months.some(existingMonth => 
                    existingMonth.getMonth() === newMonth.getMonth() && 
                    existingMonth.getFullYear() === newMonth.getFullYear()
                )
            );
            
            setMonths(prev => [...prev, ...uniqueNewMonths]);
        }
    }, [months, width]);

    const handleMonthChange = useCallback((date: Date) => {
        setCurrentDate(date);
        onMonthChange?.(date);
    }, [onMonthChange]);

    const handleMomentumScrollEnd = useCallback(({ nativeEvent }: any) => {
        const { contentOffset } = nativeEvent;
        const currentIndex = Math.round(contentOffset.x / width);
        
        if (currentIndex >= 0 && currentIndex < months.length) {
            const targetDate = months[currentIndex];
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

    const memoizedGetDaysInMonth = useCallback(getDaysInMonth, []);
    const memoizedIsSelected = useCallback(isSelected, [selectedDates]);

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
                    isSelected={memoizedIsSelected}
                    todayDate={todayDate}
                    isCurrentMonth={isCurrentMonth}
                    getDaysInMonth={memoizedGetDaysInMonth}
                />
            </View>
        );
    }, [width, calendarHeight, currentTranslation, memoizedIsSelected, memoizedGetDaysInMonth, handleChevronPress]);

    const getItemLayout = useCallback((data: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    }), [width]);

    const keyExtractor = useCallback((item: Date, index: number) => 
        `${item.getFullYear()}-${item.getMonth()}-${index}`, 
    []);

    useEffect(() => {
        const index = months.findIndex(date =>
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear()
        );
        if (index !== -1) {
            flatListRef.current?.scrollToIndex({ index, animated: false });
        }
    }, []);

    return (
        <View className="mt-2">
            <FlatList
                ref={flatListRef}
                data={months}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                pagingEnabled
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
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