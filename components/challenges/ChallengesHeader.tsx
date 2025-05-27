import i18n from "@/i18n";
import { View } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useFriends } from "@/hooks/useFriends";
import { PlusIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import Avatar from "@/components/common/Avatar";
import IconCircle from "@/components/common/IconCircle";
import HistoryIcon from "@/components/icons/HistoryIcon";

export default function ChallengesHeader() {
    const { user } = useAuth();
    const { friends } = useFriends();

    return (
        <Header
            title={i18n.t("challenges.header")}
            leftSection={
                <Link href={`/user/${user?.user_id}`}>
                    <Avatar
                        size="sm"
                        name={user?.display_name || ""}
                        source={user?.profile_picture}
                    />
                </Link>
            }
            rightSection={
                <View className="flex-row gap-2 items-center">
                    <IconCircle
                        onPress={() => router.push("/(app)/history")}
                        icon={HistoryIcon}
                    />
                    <IconCircle
                        disabled={friends?.length === 0}
                        onPress={() => router.push("/(app)/create_challenge")}
                        icon={PlusIcon}
                    />
                </View>
            }
        />
    )
}