import i18n from "@/i18n";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { useSegments } from "expo-router";
import { BoltIcon as BoltIconOutline, UsersIcon as UsersIconOutline } from "react-native-heroicons/outline";
import { BoltIcon as BoltIconSolid, UsersIcon as UsersIconSolid } from "react-native-heroicons/solid";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";

export default function Layout() {
    const segments = useSegments();

    return (
        <SafeAreaView className="flex-1">
            <Tabs>
                <TabSlot />
                <TabList className="items-center border-t border-neutral-100 dark:border-neutral-800 h-20">
                    <TabTrigger name="challenges" href="/challenges" style={styles.tabTrigger} className="w-1/2 items-center gap-0.5">
                        <Icon icon={segments[2] === "challenges" ? BoltIconSolid : BoltIconOutline} size={28} strokeWidth={1.5} />
                        <Text className="text-sm font-medium">{i18n.t("tabs.challenges")}</Text>
                    </TabTrigger>
                    <TabTrigger name="friends" href="/friends" style={styles.tabTrigger} className="w-1/2 items-center gap-0.5">
                        <Icon icon={segments[2] === "friends" ? UsersIconSolid : UsersIconOutline} size={28} strokeWidth={1.5} />
                        <Text className="text-sm font-medium">{i18n.t("tabs.friends")}</Text>
                    </TabTrigger>
                </TabList>
            </Tabs>
        </SafeAreaView>
    );
}

// Nativewind className cannot change this value so it must be made this way
const styles = StyleSheet.create({
    tabTrigger: {
        flexDirection: "column",
    }
})