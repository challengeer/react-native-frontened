import Text from "@/components/Text";
import { ScrollView, View } from "react-native";
import OptionButton from "@/components/settings/optionButton";
import Icon from "@/components/Icon";
import { ArrowLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { router } from "expo-router";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";

export default function SettingsPage() {

    const data = {
        "Name": "Display name",
        "Username": "Username",
        "Mobile number": "0905 123 456",
        "Email": "email@example.com",
        "Password": "",
        "App appearance": "",
        "Language": "",
    }

    return (
        <ScrollView>
            <Header title="Settings" leftSection={
                <IconCircle
                    icon={ArrowLeftIcon}
                    onPress={() => router.back()}
                />} />
            <View className="px-4 py-2 gap-4">

                {/* ACCOUNT SETTINGS */}
                <View>
                    <Text className="mb-2 text-lg">
                        Account
                    </Text>
                    <OptionButton title="Profile picture" value="" onPress={() => { }} className="rounded-t-lg" borderBottom rightSection={<Avatar name="John Doe" size="sm" />} />
                    {Object.entries(data).map(([key, value], index, array) => (
                        <OptionButton
                            title={key}
                            value={value}
                            onPress={() => { }}
                            borderBottom
                            className={`                        
                        ${index === array.length - 1 ? 'rounded-b-lg border-b-0' : ''}
                    `}
                            rightSection={
                                <Icon icon={ChevronRightIcon} size={20} />
                            }
                        />
                    ))}
                </View>

                {/* PRIVACY POLICY & LOG OUT */}
                <View>
                    <Text className="mb-2 text-lg">
                        Privacy
                    </Text>
                    <OptionButton title="Privacy policy" rounded onPress={() => { }} value="" rightSection={<Icon icon={ChevronRightIcon} size={20} />} />
                </View>
                <Button title="Log out" onPress={() => { }} size="lg" variant="logout" />

                {/* VERSION */}
                <View className="items-center justify-center">
                    <Text type="secondary" className="text-sm">
                        Challengeer v 1.0.0
                    </Text>
                    <Text type="secondary" className="text-sm">
                        Košice, Slovakia
                    </Text>
                </View>
            </View>
        </ScrollView>

    )
}