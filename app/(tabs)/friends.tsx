import i18n from "@/i18n";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { UserPlusIcon } from "react-native-heroicons/solid";
import UserInterface from "@/types/UserInterface";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import FriendsHeader from "@/components/friends/FriendsHeader";
import UserItem from "@/components/UserItem";
import Text from "@/components/Text";

export default function FriendsPage() {
    const [friends, setFriends] = useState<UserInterface[]>([]);
    const [contacts, setContacts] = useState<UserInterface[]>([]);

    useEffect(() => {
        fetch("https://challengeer.srodo.sk/users/1/friends")
            .then(res => res.json())
            .then(data => setFriends(data))

        fetch("https://challengeer.srodo.sk/users")
            .then(res => res.json())
            .then(data => setContacts(data))
    }, [])

    return (
        <>
            <FriendsHeader />

            <ScrollView
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
            >
                {friends.map((user) => (
                    <UserItem
                        key={user.user_id}
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
                {contacts.map((user) => (
                    <UserItem
                        key={user.user_id}
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
        </>
    )
}