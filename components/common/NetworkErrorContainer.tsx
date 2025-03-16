import i18n from "@/i18n";
import { View } from "react-native";
import { ArrowPathIcon } from "react-native-heroicons/outline";
import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import Icon from "@/components/common/Icon";

export default function NetworkErrorContainer({ onRetry }: { onRetry: () => void }) {
    return (
        <View className="flex-1 p-6 items-center justify-center">
            <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                {i18n.t("networkErrorContainer.title")}
            </Text>

            <Text type="secondary" className="text-center mb-4">
                {i18n.t("networkErrorContainer.description")}
            </Text>

            <Button
                title={i18n.t("networkErrorContainer.button")}
                variant="secondary"
                onPress={onRetry}
                className="px-12"
                leftSection={<Icon icon={ArrowPathIcon} />}
            />
        </View>
    );
};
