import i18n from "@/i18n";
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
            <Text className="text-2xl font-bold px-4 mb-4 mt-6">{i18n.t("create_challenge.step2.title")}</Text>

            <View className="px-4">
                {/* Title */}
                <InputBar
                    value={title}
                    onChangeText={setTitle}
                    className="mb-4"
                    maxLength={100}
                    placeholder={i18n.t("create_challenge.step2.title_placeholder")}
                />

                {/* Description (TextArea) */}
                <TextAreaInputBar
                    value={description}
                    onChangeText={setDescription}
                    className="mb-6"
                    maxLength={500}
                    placeholder={i18n.t("create_challenge.step2.description_placeholder")}
                />
            </View>

            <View className="p-4">
                <Button
                    size="lg"
                    title={i18n.t("create_challenge.step2.continue")}
                    onPress={onNext}
                    disabled={!title.trim()}
                />
            </View>
        </>
    );
}
