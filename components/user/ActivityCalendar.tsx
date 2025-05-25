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
        months: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    sk: {
        months: [
            "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
            "Júl", "August", "September", "Október", "November", "December"
        ],
        weekdays: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"]
    }
};

export default function ActivityCalendar({
    selectedDates = [],
    onMonthChange
}: ActivityCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { width: windowWidth } = useWindowDimensions();
    const width = windowWidth - 32;
    const flatListRef = useRef<FlatList>(null);
    const CENTER_INDEX = 1;
    const [isScrolling, setIsScrolling] = useState(false);

    const currentTranslation =
        TRANSLATIONS[i18n.locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

    const daySize = (width - 4) / 7;
    const weekHeight = daySize;
    const maxWeeks = 7;
    const calendarHeight = weekHeight * maxWeeks + 32;

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

    const isSelected = useCallback((day: number | null, monthDate: Date) => {
        if (!day) return false;
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        const currentDateStr = localDate.toISOString().split("T")[0];
        return selectedDates.some(d => d.split("T")[0] === currentDateStr);
    }, [selectedDates]);

    const generateMonthsRange = useCallback((centerDate: Date) => {
        return [-1, 0, 1].map(offset => {
            const date = new Date(centerDate);
            date.setMonth(date.getMonth() + offset);
            return date;
        });
    }, []);

    const [months, setMonths] = useState(() => generateMonthsRange(currentDate));

    const handleMonthChange = useCallback((date: Date) => {
        setCurrentDate(date);
        onMonthChange?.(date);
    }, [onMonthChange]);

    const handleScroll = useCallback(({ nativeEvent }: any) => {
        const currentIndex = Math.round(nativeEvent.contentOffset.x / width);
        const direction = currentIndex - CENTER_INDEX;

        if (direction === 0 || isScrolling) return;

        setIsScrolling(true);
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        
        setCurrentDate(newDate);
        setMonths(generateMonthsRange(newDate));
        onMonthChange?.(newDate);

        // Reset scroll position after state updates
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ 
                index: CENTER_INDEX, 
                animated: false,
                viewPosition: 0.5
            });
            setIsScrolling(false);
        }, 50);
    }, [width, currentDate, onMonthChange, generateMonthsRange, isScrolling]);

    const handleMomentumScrollEnd = useCallback(() => {
        // Only handle momentum end if we're not already handling a scroll
        if (!isScrolling) {
            flatListRef.current?.scrollToIndex({ 
                index: CENTER_INDEX, 
                animated: false,
                viewPosition: 0.5
            });
        }
    }, [isScrolling]);

    const scrollToIndex = useCallback((index: number, animated: boolean = true) => {
        flatListRef.current?.scrollToIndex({
            index,
            animated,
            viewPosition: 0.5
        });
    }, []);

    // IMPORTANT: Needs a function to handle the chevron press

    const renderItem = useCallback(({ item }: { item: Date }) => {
        const today = new Date();
        const isCurrentMonth = today.getMonth() === item.getMonth() && today.getFullYear() === item.getFullYear();
        const todayDate = isCurrentMonth ? today.getDate() : null;

        return (
            <View style={{ width }} className="px-2">
                <MonthHeader
                    date={item}
                    currentTranslation={currentTranslation}
                    onChevronPress={handleChevronPress}
                />
                <MonthView
                    date={item}
                    width={width - 12}
                    calendarHeight={calendarHeight}
                    currentTranslation={currentTranslation}
                    isSelected={isSelected}
                    todayDate={todayDate}
                    isCurrentMonth={isCurrentMonth}
                    getDaysInMonth={getDaysInMonth}
                />
            </View>
        );
    }, [width, calendarHeight, currentTranslation, isSelected]);

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: width,
        offset: width * index,
        index
    }), [width]);

    const keyExtractor = useCallback((item: Date) =>
        `${item.getFullYear()}-${item.getMonth()}`, []);

    useEffect(() => {
        requestAnimationFrame(() => {
            flatListRef.current?.scrollToIndex({ index: CENTER_INDEX, animated: false });
        });
    }, []);

    return (
        <View className="mt-2 flex-1">
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
                initialScrollIndex={CENTER_INDEX}
                getItemLayout={getItemLayout}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                contentContainerStyle={{ alignItems: "center" }}
                windowSize={3}
                maxToRenderPerBatch={3}
                removeClippedSubviews
            />
        </View>
    );
}
