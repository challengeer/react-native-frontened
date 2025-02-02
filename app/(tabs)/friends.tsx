import Text from "@/components/Text";
import FriendDisplay from "@/components/friends/FriendDisplay";
import { View } from "react-native";
import CustomButton from "@/components/CustomButton";
import Icon from "@/components/Icon";
import { UserPlusIcon, XMarkIcon } from "react-native-heroicons/solid";
import CustomAvatar from "@/components/CustomAvatar";
import FriendsHeader from "@/components/friends/FriendsHeader";

export default function FriendsPage() {
    return (
        <View>
            <FriendsHeader />
            <FriendDisplay rightSection={
                <View className="flex-row gap-2 items-center">
                    <CustomButton title="Add" leftSection={
                        <Icon icon={UserPlusIcon} lightColor="white" darkColor="white" />
                    } />
                    <Icon icon={XMarkIcon} />
                </View>
            } 
            leftSection={
                <CustomAvatar />
            } />
        </View>
    )
}