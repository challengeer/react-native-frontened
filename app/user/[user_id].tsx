import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ShareIcon, Cog8ToothIcon } from "react-native-heroicons/outline";
import UserInterface from "@/types/UserInterface";
import Text from "@/components/Text";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import Avatar from "@/components/Avatar";

export default function UserPage() {
    const { user_id } = useLocalSearchParams<{ user_id: string }>();

    const { data, isPending, error } = useQuery<UserInterface>({
        queryKey: ["user", user_id],
        queryFn: async () => {
            const response = await fetch(`https://challengeer.srodo.sk/users/${encodeURIComponent(user_id)}`);
            return response.json();
        },
    });

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Header
                title="Profile"
                leftSection={<IconCircle icon={ArrowLeftIcon} onPress={() => router.back()} />}
                rightSection={
                    <View className="flex-row items-center gap-2">
                        <IconCircle icon={ShareIcon} />
                        {user_id == "1" &&
                            <IconCircle icon={Cog8ToothIcon} onPress={() => router.push("/settings")} />
                        }
                    </View>
                }
            />

            {isPending ? (
                <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
            ) : error ? (
                <Text className="p-4">Error</Text>
            ) : (
                <ScrollView>
                    <View className="items-center">
                        <Avatar size="lg" source={data.profile_picture} name={data.display_name} />
                        <Text className="mt-2 text-2xl font-bold">{data.display_name}</Text>
                        <Text type="secondary">@{data.username}</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}