import i18n from "@/i18n";
import { Link, router } from "expo-router";
import { useAuth } from "@/components/context/AuthProvider";
import { PlusIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import Avatar from "@/components/common/Avatar";
import IconCircle from "@/components/common/IconCircle";

export default function ChallengesHeader() {
    const { user } = useAuth();

    return (
        <Header
            title={i18n.t("challenges.header")}
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
                <IconCircle onPress={() => router.push("/(app)/create_challenge")} icon={PlusIcon} />
            }
        />
    )
}