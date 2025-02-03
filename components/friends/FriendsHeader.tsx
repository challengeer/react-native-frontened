import { View } from "react-native";
import Header from "@/components/Header";
import FriendInvite from "@/components/friends/FriendInvite";
import FriendSearch from "@/components/friends/FriendSearch";
import Avatar from "@/components/Avatar";

export default function FriendsHeader() {
    return (
        <Header
            title="Friends"
            leftSection={
                <Avatar size="sm" name="Mark Takac" />
            }
            rightSection={
                <View className="flex-row gap-2 items-center">
                    <FriendInvite />
                    <FriendSearch />
                </View>
            } />
    )
}