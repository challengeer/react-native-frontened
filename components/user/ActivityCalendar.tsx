import { View } from "react-native";
import Text from "@/components/common/Text";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ActivityCalendarProps {
    selectedDates?: string[];
    onMonthChange?: (month: Date) => void; /* fetching i guess */
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ActivityCalendar({ selectedDates = [], onMonthChange }: ActivityCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get the day of week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        let firstDayOfWeek = firstDay.getDay();
        // Convert Sunday from 0 to 7 to match our Monday-first calendar
        firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;
        
        const daysInMonth = lastDay.getDate();
        const weeks: (number | null)[][] = [];
        let currentWeek: (number | null)[] = [];
        
        // Add empty days before the first day of the month
        for (let i = 1; i < firstDayOfWeek; i++) {
            currentWeek.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        }
        
        // Add empty days after the last day of the month
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
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
                <Text className="text-lg font-medium">{formatMonthYear(currentDate)}</Text>
                <View className="flex-row gap-4">
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                        <ChevronLeftIcon size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeMonth(1)}>
                        <ChevronRightIcon size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View className="mb-2 flex-row justify-between">
                {WEEKDAYS.map(day => (
                    <View key={day} className="w-9 items-center">
                        <Text className="text-sm text-neutral-500">{day}</Text>
                    </View>
                ))}
            </View>

            {weeks.map((week, weekIndex) => (
                <View key={weekIndex} className="flex-row justify-between mb-2">
                    {week.map((day, dayIndex) => (
                        <View 
                            key={dayIndex} 
                            className={`w-9 h-9 rounded-lg items-center justify-center
                                ${isSelected(day) ? 'bg-purple-500' : 'bg-neutral-100 dark:bg-neutral-800'}
                                ${day === null ? 'opacity-0' : ''}`}
                        >
                            {day !== null && (
                                <Text className={`text-sm ${isSelected(day) ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
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