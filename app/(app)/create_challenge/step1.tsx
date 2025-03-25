import React, { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import RadioButton from "@/components/settings/RadioButton";

interface Step1Props {
    selectedCategory: { name: string, emoji: string } | null;
    setSelectedCategory: (category: { name: string, emoji: string }) => void;
    onNext: () => void;
}

export default function Step1({ selectedCategory, setSelectedCategory, onNext }: Step1Props) {
    const categories = [
        { name: "Bodyweight Workouts", emoji: "💪" },
        { name: "HIIT (High-Intensity Interval Training)", emoji: "🔥" },
        { name: "Core & Abs", emoji: "🏋️‍♂️" },
        { name: "Yoga", emoji: "🧘‍♂️" },
        { name: "Strength Training", emoji: "💪" },
        { name: "Endurance", emoji: "🏃‍♂️" },
        { name: "Cardio", emoji: "🏃‍♂️" },
        { name: "Flexibility", emoji: "🤸‍♂️" },
        { name: "Balance", emoji: "🧠" },
    ];

    return (
        <>
            <Text className="text-2xl font-bold px-4 mb-4 mt-6">Select sports category</Text>

            <ScrollView className="flex-1">
                {categories.map((category, index) => (
                    <Pressable
                        key={category.name}
                        className={`border-b border-neutral-100 dark:border-neutral-800 py-4 px-4 items-center flex-row gap-4 ${index === 0 && "border-t"}`}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <View className="flex-1 flex-row items-center gap-2">
                            <Text className="text-2xl">{category.emoji}</Text>
                            <Text className="text-lg text-ellipsis">{category.name}</Text>
                        </View>
                        <RadioButton
                            selected={selectedCategory?.name === category.name}
                            onPress={() => setSelectedCategory(category)}
                        />
                    </Pressable>
                ))}
            </ScrollView>


            <View className="p-4">
                <Button
                    size="lg"
                    title="Continue"
                    onPress={onNext}
                    disabled={!selectedCategory}
                />
            </View>
        </>
    );
}

