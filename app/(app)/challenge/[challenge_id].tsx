import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import i18n from "@/i18n";
import IconCircle from "@/components/common/IconCircle";
import { ArrowLeftIcon, ClockIcon, TrophyIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import ChallengeAvatar from "@/components/challenges/ChallengeAvatar";
import { ScrollView, View } from "react-native";
import Icon from "@/components/common/Icon";


export default function ChallengePage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();

    return (
        <SafeAreaView className="flex-1">
            <Header title={i18n.t("challenges.header")} leftSection={<IconCircle icon={ArrowLeftIcon} onPress={() => router.back()} />} />
            <ScrollView className="px-4">
                <View className="items-center gap-2">
                    <View className="flex-row items-center gap-2">
                        <ChallengeAvatar emoji="🏃‍♂️" hasNewSubmissions={true} size="lg" />
                    </View>
                    <Text className="text-2xl font-bold">Challenge: {challenge_id}</Text>
                    <Text type="secondary" className="text-base">Don't forget to join the challenge!</Text>
                </View>
                <View className="gap-2 mt-4">
                    <View className="flex-row items-center gap-2">
                        <Icon icon={TrophyIcon} lightColor="#737373" darkColor="#a3a3a3"/>
                        <Text type="secondary">Running 10km</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Icon icon={ClockIcon} lightColor="#737373" darkColor="#a3a3a3"/> {/* Change color later maybe? */}
                        <Text type="secondary">2h left</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}