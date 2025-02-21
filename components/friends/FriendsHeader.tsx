import i18n from "@/i18n";
import { View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/components/context/AuthProvider";
import Header from "@/components/common/Header";
import FriendRequests from "@/components/friends/FriendRequests";
import FriendSearch from "@/components/friends/FriendSearch";
import Avatar from "@/components/common/Avatar";

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
                    <FriendSearch />
                </View>
            }
        />
    )
}