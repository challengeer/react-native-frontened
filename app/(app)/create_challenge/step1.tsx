import React, { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import RadioButton from "@/components/settings/RadioButton";
import i18n from "@/i18n";

interface Step1Props {
    selectedCategory: { name: string, emoji: string } | null;
    setSelectedCategory: (category: { name: string, emoji: string }) => void;
    onNext: () => void;
}

export default function Step1({ selectedCategory, setSelectedCategory, onNext }: Step1Props) {
    const categories = [
        { key: "workout", emoji: "💪" },
        { key: "running", emoji: "🏃‍♂️" },
        { key: "walking", emoji: "🚶‍♂️" },
        { key: "swimming", emoji: "🏊‍♂️" },
        { key: "cycling", emoji: "🚴‍♂️" },
        { key: "yoga", emoji: "🧘‍♂️" },
        { key: "pilates", emoji: "🧘‍♀️" },
        { key: "dancing", emoji: "💃" },
        { key: "boxing", emoji: "🥊" },
        { key: "skating", emoji: "⛸️" },
        { key: "hiking", emoji: "🥾" },
        { key: "rock_climbing", emoji: "🧗‍♂️" },
    ];

    return (
        <>
            <Text className="text-2xl font-bold px-4 mb-4 mt-6">{i18n.t("sports.title")}</Text>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
            >
                {categories.map((category, index) => (
                    <Pressable
                        key={category.key}
                        className={`border-b border-neutral-100 dark:border-neutral-800 py-4 px-4 items-center flex-row gap-4 ${index === 0 && "border-t"}`}
                        onPress={() => setSelectedCategory({ name: category.key, emoji: category.emoji })}
                    >
                        <View className="flex-1 flex-row items-center gap-2">
                            <Text className="text-2xl">{category.emoji}</Text>
                            <Text className="text-lg text-ellipsis">{i18n.t(`sports.categories.${category.key}`)}</Text>
                        </View>
                        <RadioButton
                            selected={selectedCategory?.name === category.key}
                            onPress={() => setSelectedCategory({ name: category.key, emoji: category.emoji })}
                        />
                    </Pressable>
                ))}
            </ScrollView>

            <View className="p-4">
                <Button
                    size="lg"
                    title={i18n.t("sports.continue")}
                    onPress={onNext}
                    disabled={!selectedCategory}
                />
            </View>
        </>
    );
}

