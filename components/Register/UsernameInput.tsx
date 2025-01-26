import i18n from "@/i18n";
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from "react-native-heroicons/outline";
import { View } from "react-native";
import InputBar from "@/components/InputBar";
import Text from "@/components/Text";
import Icon from "@/components/Icon";

export default function UsernameInput() {
    return (
        <View>
            <InputBar
                label={i18n.t("register.usernameLabel")}
                keyboardType="default"
            />
            <View> {/* Just to have these thing ready as well, couldn't figure out how to color them yet*/}
                <View className="flex-row items-center gap-2">
                    <Icon icon={CheckCircleIcon} lightColor="green-500" darkColor="green-600" strokeWidth={1} />
                    <Text className="text-sm">
                        {i18n.t("register.usernameAvailable")}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <Icon icon={XCircleIcon} lightColor="red-500" darkColor="red-600" strokeWidth={1} />
                    <Text className="text-sm">
                        {i18n.t("register.usernameTaken")}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <Icon icon={QuestionMarkCircleIcon} lightColor="green-500" darkColor="green-600" strokeWidth={1} />
                    <Text className="text-sm">
                        {i18n.t("register.usernameChecking")}
                    </Text>
                </View>
            </View>
        </View>
    );
}