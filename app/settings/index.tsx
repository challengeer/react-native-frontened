import Text from "@/components/Text";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import OptionButton from "@/components/settings/OptionButton"; // No idea what the problem is
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";
import i18n from "@/i18n";


export default function SettingsPage() {
    const handleOptionPress = (key: string) => {
        switch (key) {
            case i18n.t("settings.appearance.header"):
                router.push("/settings/appAppearance");
                break;
            case i18n.t("settings.language.header"):
                router.push("/settings/language");
                break;
            case i18n.t("settings.profile.displayName"):
                router.push("/settings/name");
                break;
            case i18n.t("settings.profile.username"):
                router.push("/settings/username");
                break;
            case i18n.t("settings.profile.mobileNumber"):
                router.push("/settings/mobile");
                break;
            case i18n.t("settings.profile.email"):
                router.push("/settings/email");
                break;
            case i18n.t("settings.profile.password"):
                router.push("/settings/password");
                break;
            default:
                console.log(`No route defined for ${key}`);
        }
    };

    const data = {
        [i18n.t("settings.profile.displayName")]: "Display name",
        [i18n.t("settings.profile.username")]: "@username",
        [i18n.t("settings.profile.mobileNumber")]: "0905 123 456",
        [i18n.t("settings.profile.email")]: "email@example.com",
        [i18n.t("settings.profile.password")]: "",
        [i18n.t("settings.appearance.header")]: "",
        [i18n.t("settings.language.header")]: "",
    }

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
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
                    <OptionButton
                        title="Profile picture" // I don't know Slovak translation
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
                    onPress={() => {
                        // Add logout logic here
                        router.replace("/auth");
                    }}
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