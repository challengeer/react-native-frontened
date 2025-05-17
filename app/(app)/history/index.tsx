import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import HistoryList from "@/components/history/HistoryList";

export default function History() {
    return (
        <SafeAreaView className="flex-1">
            <Header
                title="Challenges history"
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />
            <HistoryList />
        </SafeAreaView>
    )
}