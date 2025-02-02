import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { UserPlusIcon } from "react-native-heroicons/solid";
import Icon from "@/components/Icon";
import CustomButton from "@/components/CustomButton";
import FriendsHeader from "@/components/friends/FriendsHeader";
import UserItem from "@/components/UserItem";
import Text from "@/components/Text";

interface Friend {
    user_id: number;
    display_name: string;
    username: string;
}

export default function FriendsPage() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [contacts, setContacts] = useState<Friend[]>([]);

    useEffect(() => {
        fetch("https://challengeer.srodo.sk/users/2/friends")
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
                {friends.map((friend) => (
                    <UserItem
                        key={friend.user_id}
                        displayName={friend.display_name}
                        username={friend.username}
                        rightSection={
                            <View className="flex-row gap-2 items-center">
                                <CustomButton
                                    title="Add"
                                    leftSection={
                                        <Icon
                                            icon={UserPlusIcon}
                                            lightColor="white"
                                            darkColor="white"
                                        />
                                    } />
                                <Icon icon={XMarkIcon} />
                            </View>
                        }
                    />
                ))}

                <Text className="text-2xl font-bold px-4 pt-4 pb-2">Contacts</Text>
                {contacts.map((user) => (
                    <UserItem
                        key={user.user_id}
                        displayName={user.display_name}
                        username={user.username}
                        rightSection={
                            <View className="flex-row gap-2 items-center">
                                <CustomButton
                                    secondary
                                    title="Invite"
                                    leftSection={
                                        <Icon icon={UserPlusIcon} />
                                    } />
                                <Icon icon={XMarkIcon} />
                            </View>
                        }
                    />
                ))}
            </ScrollView>
        </>
    )
}