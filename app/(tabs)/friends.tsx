import i18n from "@/i18n";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { UserPlusIcon } from "react-native-heroicons/solid";
import { useQuery } from "@tanstack/react-query";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import FriendsHeader from "@/components/friends/FriendsHeader";
import UserItem from "@/components/UserItem";
import Text from "@/components/Text";
import axios from "axios";

export default function FriendsPage() {
    const { data, isPending, error } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const friends = await axios.get("https://challengeer.srodo.sk/users/1/friends");
            const contacts = await axios.get("https://challengeer.srodo.sk/users")

            return { friends: friends.data, contacts: contacts.data }
        },
    });

    return (
        <>
            <FriendsHeader />

            {isPending ? (
                <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
            ) : error ? (
                <Text className="p-4">Error</Text>
            ) : (
                <ScrollView
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                >
                    {data.friends.map((user) => (
                        <UserItem
                            key={user.user_id}
                            userId={user.user_id}
                            displayName={user.display_name}
                            username={user.username}
                            profilePicture={user.profile_picture}
                            rightSection={
                                <View className="flex-row gap-2 items-center">
                                    <Button
                                        size="sm"
                                        title="Add"
                                        leftSection={
                                            <Icon
                                                icon={UserPlusIcon}
                                                lightColor="white"
                                                darkColor="white"
                                            />
                                        }
                                    />
                                    <Icon icon={XMarkIcon} />
                                </View>
                            }
                        />
                    ))}

                    <Text className="text-2xl font-bold px-4 pt-4 pb-2">{i18n.t("friends.contacts")}</Text>
                    {data.contacts.map((user) => (
                        <UserItem
                            key={user.user_id}
                            userId={user.user_id}
                            displayName={user.display_name}
                            username={user.username}
                            profilePicture={user.profile_picture}
                            rightSection={
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    title="Invite"
                                    leftSection={
                                        <Icon icon={UserPlusIcon} />
                                    }
                                />
                            }
                        />
                    ))}
                </ScrollView>
            )}
        </>
    )
}