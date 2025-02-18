import i18n from "@/i18n";
import { useCallback, useState } from "react";
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from "react-native-heroicons/solid";
import { View } from "react-native";
import { debounce } from "lodash";
import InputBar from "@/components/common/InputBar";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";
import axios from "axios";

export default function UsernameInput() {
    const [usernameState, setUsernameState] = useState<"available" | "taken" | "checking" | undefined>();

    const search = async (username: string) => {
        if (!username) return setUsernameState(undefined);
        setUsernameState("checking");
        const response = await axios.get(`https://challengeer.srodo.sk/check-username/${username}`);
        setUsernameState(response.data.exists ? "taken" : "available");
    }

    const debouncedSearch = useCallback(debounce(search, 500), []);

    let stateComponent = undefined;
    switch (usernameState) {
        case "available":
            stateComponent = (
                <View className="flex-row items-center gap-1">
                    <Icon icon={CheckCircleIcon} size={20} lightColor="#22c55e" darkColor="#22c55e" />
                    <Text type="secondary" className="text-sm">
                        {i18n.t("register.usernameAvailable")}
                    </Text>
                </View>
            )
            break;
        case "taken":
            stateComponent = (
                <View className="flex-row items-center gap-1">
                    <Icon icon={XCircleIcon} size={20} lightColor="#ef4444" darkColor="#ef4444" />
                    <Text type="secondary" className="text-sm">
                        {i18n.t("register.usernameTaken")}
                    </Text>
                </View>
            );
            break;
        case "checking":
            stateComponent = (
                <View className="flex-row items-center gap-1">
                    <Icon icon={QuestionMarkCircleIcon} size={20} lightColor="#737373" darkColor="#a3a3a3" />
                    <Text type="secondary" className="text-sm">
                        {i18n.t("register.usernameChecking")}
                    </Text>
                </View>
            );
            break;
    }

    return (
        <View className="gap-2">
            <InputBar
                label={i18n.t("register.usernameLabel")}
                keyboardType="default"
                onChangeText={debouncedSearch}
                autoFocus
            />
            {stateComponent}
        </View>
    );
}