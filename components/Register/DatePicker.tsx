import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
    return (
        <View className="flex-1">
            <DateTimePicker
                testID="datePicker"
                value={value}
                mode="date"
                display="spinner"
                onChange={(_, date) => date && onChange(date)}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                themeVariant="light"
                style={{ flex: 1, width: '100%' }}
            />
        </View>
    );
}