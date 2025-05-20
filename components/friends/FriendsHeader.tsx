import i18n from "@/i18n";
import { View } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { UserPlusIcon } from "react-native-heroicons/solid";
import { useFriends } from "@/hooks/useFriends";
import Header from "@/components/common/Header";
import Avatar from "@/components/common/Avatar";
import IconCircle from "@/components/common/IconCircle";
import Text from "@/components/common/Text";

export default function FriendsHeader() {
    const { user } = useAuth();
    const { friendRequestsReceived } = useFriends();

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
                    <View className="relative">
                        <IconCircle
                            onPress={() => router.push("/add_friends")}
                            icon={UserPlusIcon}
                        />
                        {friendRequestsReceived && friendRequestsReceived.length > 0 &&
                            <View pointerEvents="none" className="absolute -top-1.5 -right-1.5 w-5 h-5 items-center justify-center bg-red-500 rounded-full">
                                <Text className="text-white text-xs font-medium">{friendRequestsReceived.length}</Text>
                            </View>
                        }
                    </View>
                    
                    <IconCircle
                        onPress={() => router.push("/search")}
                        icon={MagnifyingGlassIcon}
                    />
                </View>
            }
        />
    )
}