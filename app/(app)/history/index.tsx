import { useState } from "react";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/common/SearchBar";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import HistoryList from "@/components/history/HistoryList";

export default function History() {
    const [search, setSearch] = useState<string>("");

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
            <SearchBar onSearch={setSearch} className="mx-4 mt-2" />
            <HistoryList search={search} />
        </SafeAreaView>
    )
}