import i18n from "@/i18n";
import { View } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/components/context/AuthProvider";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import FriendRequests from "@/components/friends/FriendRequests";
import Avatar from "@/components/common/Avatar";
import IconCircle from "@/components/common/IconCircle";

export default function FriendsHeader() {
    const { user } = useAuth();

    return (
        <Header
            title={i18n.t("friends.header")}
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
                    <FriendRequests />
                    <IconCircle onPress={() => router.push("/search")} icon={MagnifyingGlassIcon} />
                </View>
            }
        />
    )
}