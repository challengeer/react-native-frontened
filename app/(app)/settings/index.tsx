import Text from "@/components/common/Text";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import OptionButton from "@/components/settings/SettingsItem";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";
import Avatar from "@/components/common/Avatar";
import i18n from "@/i18n";
import { useAuth } from "@/components/context/AuthProvider";
import { useContext } from "react";
import { LanguageContext } from "@/components/context/LanguageProvider";

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const { language } = useContext(LanguageContext) as { language: string };

    const handleOptionPress = (key: string) => {
        switch (key) {
            case "appearance":
                router.push("/settings/app_appearance");
                break;
            case "language":
                router.push("/settings/language");
                break;
            case "displayName":
                router.push("/settings/name");
                break;
            case "username":
                router.push("/settings/username");
                break;
            case "mobileNumber":
                router.push("/settings/mobile");
                break;
            case "email":
                router.push("/settings/email");
                break;
            case "password":
                router.push("/settings/password");
                break;
            default:
                console.log(`No route defined for ${key}`);
        }
    };

    const data = [
        {
            key: "displayName",
            title: i18n.t("settings.profile.displayName"),
            value: user?.display_name || "",
        },
        {
            key: "username",
            title: i18n.t("settings.profile.username"),
            value: user?.username || "",
        },
        {
            key: "mobileNumber",
            title: i18n.t("settings.profile.mobileNumber"),
            value: user?.phone_number || "",
        },
        {
            key: "email",
            title: i18n.t("settings.profile.email"),
            value: user?.email || "",
        },
        {
            key: "password",
            title: i18n.t("settings.profile.password"),
            value: "",
        },
        {
            key: "appearance",
            title: i18n.t("settings.appearance.header"),
            value: "",
        },
        {
            key: "language",
            title: i18n.t("settings.language.header"),
            value: "",
        },
    ];

    const settingsData = [
        {
            title: "Profile picture",
            value: "",
            route: "/settings/profilePicture",
            rightSection: <Avatar name="John Doe" size="sm" />,
            key: "profile-picture"
        },
        ...data.map((item) => ({
            title: item.title,
            value: item.value,
            key: item.key,
            route: null, // Will use handleOptionPress instead
            rightSection: undefined
        }))
    ];

    return (
        <View key={language} className="flex-1 bg-white dark:bg-neutral-900">
            <Header
                title={i18n.t("settings.header")}
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
                        {i18n.t("settings.account")}
                    </Text>
                    <View className="overflow-hidden rounded-lg">
                        {settingsData.map((item, index) => (
                            <OptionButton
                                key={item.key}
                                title={item.title}
                                value={item.value}
                                onPress={() => item.route ? router.push(item.route as any) : handleOptionPress(item.key)}
                                rightSection={item.rightSection}
                                borderBottom={index !== settingsData.length - 1}
                                withArrow
                                isFirst={index === 0}
                                isLast={index === settingsData.length - 1}
                            />
                        ))}
                    </View>
                </View>

                {/* PRIVACY POLICY & LOG OUT */}
                <View className="mb-4">
                    <Text className="mb-2 text-2xl font-bold">
                        {i18n.t("settings.privacy")}
                    </Text>
                    <OptionButton
                        title={i18n.t("settings.privacyPolicy")}
                        rounded
                        onPress={() => router.push("/settings/privacyPolicy")}
                        withArrow
                    />
                </View>

                <Button
                    title={i18n.t("settings.logout")}
                    size="lg"
                    variant="logout"
                    onPress={logout}
                />

                {/* VERSION */}
                <View className="my-4 items-center justify-center">
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.version")}
                    </Text>
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.location")}
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}