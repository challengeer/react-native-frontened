import Header from "@/components/Header";
import CustomAvatar from "@/components/CustomAvatar";
import IconCircle from "@/components/IconCircle";
import Text from "@/components/Text";
import { UserPlusIcon } from "react-native-heroicons/solid";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { View } from "react-native";
import FriendInvite from "@/components/friends/FriendInvite";
import i18n from "@/i18n"; // Add language support later

export default function FriendsHeader() {
    return (
        <Header title="Friends" leftSection={
            <CustomAvatar name="Mark Takac" />
        }
            rightSection={
                <View className="flex-row gap-2 items-center">
                    <FriendInvite />
                    <IconCircle icon={MagnifyingGlassIcon} size={36} />
                </View>
            } />
    )
}