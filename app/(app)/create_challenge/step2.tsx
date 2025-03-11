import { View } from "react-native";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import { InputBar, TextAreaInputBar } from "@/components/common/InputBar";
import { TextInput } from "react-native";

interface Step2Props {
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    onNext: () => void;
}

export default function Step2({ title, setTitle, description, setDescription, onNext }: Step2Props) {
    return (
        <View className="flex-1 mt-6">
            <Text className="text-2xl font-bold mb-2">Add more information</Text>
            {/* Title */}
            <InputBar
                value={title}
                onChangeText={setTitle}
                className="mb-6"
                placeholder="Title"
            />

            {/* Description (TextArea) */}
            <TextAreaInputBar
                value={description}
                onChangeText={setDescription}
                className="mb-6"
                placeholder="Description (optional)"
            />

            <View className="flex-row gap-4">
                <Button
                    title="Continue"
                    onPress={onNext}
                    disabled={!title.trim()}
                    className="flex-1 mb-4"
                />
            </View>
        </View>
    );
}
