import i18n from "@/i18n";
import { View } from "react-native";
import Header from "@/components/Header";
import FriendRequests from "@/components/friends/FriendRequests";
import FriendSearch from "@/components/friends/FriendSearch";
import Avatar from "@/components/Avatar";

export default function FriendsHeader() {
    return (
        <Header
            title={i18n.t("friends.header")}
            leftSection={
                <Avatar size="sm" name="Mark Takac" />
            }
            rightSection={
                <View className="flex-row gap-2 items-center">
                    <FriendRequests />
                    <FriendSearch />
                </View>
            } />
    )
}