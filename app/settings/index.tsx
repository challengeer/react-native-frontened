import Text from "@/components/Text";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import OptionButton from "@/components/settings/OptionButton"; // No idea what the problem is
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";

export default function SettingsPage() {
    const handleOptionPress = (key: string) => {
        switch (key) {
            case "App appearance":
                router.push("/settings/appAppearance");
                break;
            case "Language":
                router.push("/settings/language");
                break;
            case "Name":
                router.push("/settings/name");
                break;
            case "Username":
                router.push("/settings/username");
                break;
            case "Mobile number":
                router.push("/settings/mobile");
                break;
            case "Email":
                router.push("/settings/email");
                break;
            case "Password":
                router.push("/settings/password");
                break;
            default:
                console.log(`No route defined for ${key}`);
        }
    };

    const data = {
        "Name": "Display name",
        "Username": "@username",
        "Mobile number": "0905 123 456",
        "Email": "email@example.com",
        "Password": "",
        "App appearance": "",
        "Language": "",
    }

    return (
        <>
            <Header
                title="Settings"
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <ScrollView
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                className="px-4"
            >
                {/* ACCOUNT SETTINGS */}
                <View className="mb-4">
                    <Text className="mb-2 text-2xl font-bold">
                        Account
                    </Text>
                    <OptionButton
                        title="Profile picture"
                        onPress={() => router.push("/settings/profilePicture")}
                        className="rounded-t-lg"
                        borderBottom
                        rightSection={<Avatar name="John Doe" size="sm" />}
                        withArrow
                    />
                    {Object.entries(data).map(([key, value], index, array) => (
                        <OptionButton
                            key={key}
                            title={key}
                            value={value}
                            onPress={() => handleOptionPress(key)}
                            borderBottom
                            className={`                        
                                ${index === array.length - 1 ? 'rounded-b-lg border-b-0' : ''}
                            `}
                            withArrow
                        />
                    ))}
                </View>

                {/* PRIVACY POLICY & LOG OUT */}
                <View className="mb-4">
                    <Text className="mb-2 text-2xl font-bold">
                        Privacy
                    </Text>
                    <OptionButton
                        title="Privacy policy"
                        rounded
                        onPress={() => router.push("/settings/privacyPolicy")}
                        withArrow
                    />
                </View>

                <Button
                    title="Log out"
                    size="lg"
                    variant="logout"
                    onPress={() => {
                        // Add logout logic here
                        router.replace("/auth");
                    }}
                />

                {/* VERSION */}
                <View className="my-4 items-center justify-center">
                    <Text type="secondary" className="text-sm">
                        Challengeer v 1.0.0
                    </Text>
                    <Text type="secondary" className="text-sm">
                        Košice, Slovakia
                    </Text>
                </View>
            </ScrollView>
        </>
    )
}