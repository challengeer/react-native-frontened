import i18n from "@/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BoltIcon as BoltIconOutline, UsersIcon as UsersIconOutline } from "react-native-heroicons/outline";
import { BoltIcon as BoltIconSolid, UsersIcon as UsersIconSolid } from "react-native-heroicons/solid";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";
import { useCallback, useState, useMemo } from "react";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";
import ChallengesPage from "./challenges";
import FriendsPage from "./friends";

export default function Layout() {
    const router = useRouter();
    const { tab } = useLocalSearchParams<{ tab: string }>();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(tab === "friends" ? 1 : 0);

    const routes = useMemo(() => [
        { key: "challenges", title: i18n.t("tabs.challenges") },
        { key: "friends", title: i18n.t("tabs.friends") },
    ], []);

    const renderScene = useMemo(() => SceneMap({
        challenges: () => <ChallengesPage />,
        friends: () => <FriendsPage />,
    }), []);

    const handleIndexChange = useCallback((newIndex: number) => {
        setIndex(newIndex);
        const newTab = routes[newIndex].key;
        router.setParams({ tab: newTab });
    }, [router, routes]);

    const renderTabBar = useCallback(() => (
        <View className="absolute bottom-0 left-0 right-0 border-t border-neutral-100 dark:border-neutral-800 h-20 flex-row bg-neutral-100 dark:bg-neutral-900">
            {routes.map((route, i) => (
                <View
                    key={route.key}
                    className="flex-1 items-center justify-center"
                    onTouchEnd={() => handleIndexChange(i)}
                >
                    <Icon
                        icon={i === index ? (i === 0 ? BoltIconSolid : UsersIconSolid) : (i === 0 ? BoltIconOutline : UsersIconOutline)}
                        size={28}
                        strokeWidth={1.5}
                    />
                    <Text className="text-sm font-medium">{route.title}</Text>
                </View>
            ))}
        </View>
    ), [index, routes, handleIndexChange]);

    const navigationState = useMemo(() => ({
        index,
        routes
    }), [index, routes]);

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1">
                <TabView
                    navigationState={navigationState}
                    renderScene={renderScene}
                    onIndexChange={handleIndexChange}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                    swipeEnabled={true}
                    tabBarPosition="bottom"
                    lazy={true}
                />
            </View>
        </SafeAreaView>
    );
}