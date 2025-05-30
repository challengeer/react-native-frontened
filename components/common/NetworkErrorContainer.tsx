import i18n from "@/i18n";
import { ArrowPathIcon } from "react-native-heroicons/outline";
import Icon from "@/components/common/Icon";
import EmptyStateMessage from "@/components/common/EmptyStateMessage";

export default function NetworkErrorContainer({ onRetry }: { onRetry: () => void }) {
    return (
        <EmptyStateMessage
            title={i18n.t("networkErrorContainer.title")}
            description={i18n.t("networkErrorContainer.description")}
            buttonTitle={i18n.t("networkErrorContainer.button")}
            onPress={onRetry}
            buttonLeftSection={<Icon icon={ArrowPathIcon} />}
            buttonVariant="secondary"
        />
    );
};
