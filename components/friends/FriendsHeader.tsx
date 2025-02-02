import Header from "@/components/Header";
import CustomAvatar from "@/components/CustomAvatar";
import IconCircle from "@/components/IconCircle";
import Text from "@/components/Text";
import { UserPlusIcon } from "react-native-heroicons/solid";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { View } from "react-native";
import i18n from "@/i18n"; // Add language support later

export default function FriendsHeader() {
    return (
        <Header title="Friends" leftSection={
            <CustomAvatar name="Mark Takac" />
        }
            rightSection={
                <View className="flex-row gap-2 items-center">
                    <View className="relative">
                        <View className="absolute 
                        items-center 
                        justify-center 
                        left-5 
                        bottom-6 
                        bg-red-500 
                        text-white 
                        text-xs 
                        aspect-square 
                        rounded-full 
                        w-5 
                        h-5">
                            9
                        </View> {/* I have no idea how to make a circle responsible but if there is a lot of friend requests we'll just put 9+ there */}
                        <IconCircle icon={UserPlusIcon} size={36} />
                    </View>
                    <IconCircle icon={MagnifyingGlassIcon} size={36} />
                </View>
            } />
    )
}