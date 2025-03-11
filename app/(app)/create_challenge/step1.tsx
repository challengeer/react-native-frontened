import { View, TouchableOpacity, ScrollView } from "react-native";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import RadioButton from "@/components/settings/RadioButton";

import { useState } from "react";

interface Step1Props {
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    onNext: () => void;
}

export default function Step1({ selectedCategory, setSelectedCategory, onNext }: Step1Props) {
    const categories = [
        { id: "1", name: "Bodyweight Workouts", emoji: "💪" },
        { id: "2", name: "HIIT (High-Intensity Interval Training)", emoji: "🔥" },
        { id: "3", name: "Core & Abs", emoji: "🏋️‍♂️" },
    ];

    return (
        <View className="flex-1 mt-6">
            <Text className="text-2xl font-bold mb-2">Select sports category</Text>
            <ScrollView className="flex-1">
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        className="border-b border-neutral-200 dark:border-neutral-700 py-4 items-center flex-row gap-2"
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <View className="flex-row items-center justify-between w-full">
                            <View className="flex-row items-center gap-2">
                                <Text>{category.emoji}</Text>
                                <Text>{category.name}</Text>
                            </View>
                            <RadioButton
                                selected={selectedCategory === category.id}
                                onPress={() => setSelectedCategory(category.id)}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>


            <Button
                title="Continue"
                onPress={onNext}
                disabled={!selectedCategory}
                className="mb-4"
            />
        </View>
    );
}

