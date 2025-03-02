import { View, ScrollView } from "react-native";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";
import ChallengesItem from "@/components/challenges/ChallengesItem";
import { router } from "expo-router";
export default function ChallengesPage() {

    const challenges = [
        {
            title: "Monday run",
            type: "Running",
            image: "https://picsum.photos/200/300",
            time: "1d left",
        },
        {
            title: "Let's hit the gym",
            type: "Gym",
            image: "https://picsum.photos/200/300",
            time: "5d left",
        }

    ]

    return (
        <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
            <ChallengesHeader />
            {challenges.map((challenge) => (
                <ChallengesItem key={challenge.title} {...challenge} onPress={() => router.push("/challenge/1")} isActive />
            ))}
        </ScrollView>
    )
}