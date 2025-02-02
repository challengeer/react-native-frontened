import Header from "@/components/Header";
import CustomAvatar from "@/components/CustomAvatar";
import { View } from "react-native";
import FriendInvite from "@/components/friends/FriendInvite";
import FriendSearch from "./FriendSearch";

export default function FriendsHeader() {
    return (
        <Header title="Friends" leftSection={
            <CustomAvatar name="Mark Takac" />
        }
            rightSection={
                <View className="flex-row gap-2 items-center">
                    <FriendInvite />
                    <FriendSearch />
                </View>
            } />
    )
}