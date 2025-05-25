import { View } from "react-native";
import { memo } from "react";
import CalendarDay from "./CalendarDay";

interface WeekRowProps {
    week: (number | null)[];
    date: Date;
    isSelected: (day: number | null, monthDate: Date) => boolean;
    isCurrentMonth: boolean;
    todayDate: number | null;
}

const WeekRow = memo(({ week, date, isSelected, isCurrentMonth, todayDate }: WeekRowProps) => (
    <View className="flex-row justify-between">
        {week.map((day: number | null, dayIndex: number) => {
            const isDaySelected = isSelected(day, date);
            const isDayToday = isCurrentMonth && day === todayDate;

            return (
                <CalendarDay
                    key={dayIndex}
                    day={day}
                    isSelected={isDaySelected}
                    isToday={isDayToday}
                />
            );
        })}
    </View>
));

export default WeekRow; 