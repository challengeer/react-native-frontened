import i18n from "@/i18n";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { useSegments } from "expo-router";
import { MapPinIcon as MapPinIconOutline, BoltIcon as BoltIconOutline, UsersIcon as UsersIconOutline } from "react-native-heroicons/outline";
import { MapPinIcon as MapPinIconSolid, BoltIcon as BoltIconSolid, UsersIcon as UsersIconSolid } from "react-native-heroicons/solid";
import { StyleSheet } from "react-native";
import Text from "@/components/Text";
import Icon from "@/components/Icon";

export default function Layout() {
    const segments = useSegments();

    return (
        <Tabs>
            <TabSlot />
            <TabList className="border-t bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                <TabTrigger name="challenges" href="/challenges" style={styles.tabTrigger} className="py-2 w-1/2 items-center gap-0.5">
                    <Icon icon={segments[1] === "challenges" ? BoltIconSolid : BoltIconOutline} size={28} strokeWidth={1.5} />
                    <Text className="text-sm font-medium">{i18n.t("tabs.challenges")}</Text>
                </TabTrigger>
                <TabTrigger name="friends" href="/friends" style={styles.tabTrigger} className="py-2 w-1/2 items-center gap-0.5">
                    <Icon icon={segments[1] === "friends" ? UsersIconSolid : UsersIconOutline} size={28} strokeWidth={1.5} />
                    <Text className="text-sm font-medium">{i18n.t("tabs.friends")}</Text>
                </TabTrigger>
            </TabList>
        </Tabs>
    );
}

// Nativewind className cannot change this value so it must be made this way
const styles = StyleSheet.create({
    tabTrigger: {
        flexDirection: "column",
    }
})