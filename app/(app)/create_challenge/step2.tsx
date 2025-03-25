import React, { View } from "react-native";
import { InputBar, TextAreaInputBar } from "@/components/common/InputBar";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";

interface Step2Props {
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    onNext: () => void;
}

export default function Step2({ title, setTitle, description, setDescription, onNext }: Step2Props) {
    return (
        <>
            <Text className="text-2xl font-bold px-4 mb-4 mt-6">Add more information</Text>

            <View className="px-4">
                {/* Title */}
                <InputBar
                    value={title}
                    onChangeText={setTitle}
                    className="mb-4"
                    placeholder="Title"
                />

                {/* Description (TextArea) */}
                <TextAreaInputBar
                    value={description}
                    onChangeText={setDescription}
                    className="mb-6"
                    placeholder="Description (optional)"
                />
            </View>

            <View className="p-4">
                <Button
                    size="lg"
                    title="Continue"
                    onPress={onNext}
                    disabled={!title.trim()}
                />
            </View>
        </>
    );
}
