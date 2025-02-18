import i18n from "@/i18n";
import { View } from "react-native";
import Header from "@/components/common/Header";
import FriendRequests from "@/components/friends/FriendRequests";
import FriendSearch from "@/components/friends/FriendSearch";
import Avatar from "@/components/common/Avatar";
import { Link } from "expo-router";

export default function FriendsHeader() {
    return (
        <Header
            title={i18n.t("friends.header")}
            leftSection={
                <Link href="/user/1">
                    <Avatar size="sm" name="John Doe" />
                </Link>
            }
            rightSection={
                <View className="flex-row gap-2 items-center">
                    <FriendRequests />
                    <FriendSearch />
                </View>
            } />
    )
}