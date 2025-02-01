import i18n from "@/i18n";
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from "react-native-heroicons/solid";
import { View } from "react-native";
import InputBar from "@/components/InputBar";
import Text from "@/components/Text";
import Icon from "@/components/Icon";

export default function UsernameInput() {
    return (
        <View className="gap-2">
            <InputBar
                label={i18n.t("register.usernameLabel")}
                keyboardType="default"
                autoFocus
            />
            <View>
                <View className="flex-row items-center gap-1">
                    <Icon icon={CheckCircleIcon} size={20} lightColor="#22c55e" darkColor="#22c55e" />
                    <Text type="secondary" className="text-sm">
                        {i18n.t("register.usernameAvailable")}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Icon icon={XCircleIcon} size={20} lightColor="#ef4444" darkColor="#ef4444" />
                    <Text type="secondary" className="text-sm">
                        {i18n.t("register.usernameTaken")}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Icon icon={QuestionMarkCircleIcon} size={20} lightColor="#737373" darkColor="#a3a3a3" />
                    <Text type="secondary" className="text-sm">
                        {i18n.t("register.usernameChecking")}
                    </Text>
                </View>
            </View>
        </View>
    );
}