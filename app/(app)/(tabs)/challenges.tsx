import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import Text from "@/components/common/Text";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";

export default function ChallengesPage() {
    const challenges = [
        {
            title: "Monday run",
            type: "Running",
            text: "👟",
            time: "1d left",
            isActive: false,
        },
        {
            title: "Let's hit the gym",
            type: "Gym",
            text: "🏋️‍♂️",
            time: "5d left",
            isActive: true,
        }
    ]

    const invites = [
        {
            title: "Let's hit legs",
            type: "Gym",
            text: "🏋️‍♂️",
            time: "5d left",
        }
    ]

    return (
        <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
            <ChallengesHeader />
            {challenges.map((challenge, index) => (
                <ChallengeItem 
                    key={challenge.title} 
                    {...challenge} 
                    onPress={() => router.push("/challenge/1")} 
                    index={index} 
                />
            ))}
            <View className="py-3">
                <Text className="text-left text-neutral-500 text-2xl font-bold px-4">Invites</Text>
                {invites.map((invite, index) => (
                    <ChallengeItem 
                        key={invite.title} 
                        {...invite} 
                        onPress={() => router.push("/challenge/1")} 
                        index={index}
                        showActions
                        onJoin={() => router.push("/challenge/1")}
                        onCancel={() => console.log("Cancelled invite")}
                    />
                ))}
            </View>
        </ScrollView>
    )
}