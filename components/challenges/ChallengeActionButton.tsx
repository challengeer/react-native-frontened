import Button from "@/components/common/Button";
import { View } from "react-native";
import Icon from "../common/Icon";
import { XMarkIcon } from "react-native-heroicons/outline";

interface ChallengeActionButtonProps {
    title?: string;
    onJoin?: () => void;
    onCancel?: () => void;
    showJoinButton?: boolean;
    showCancelButton?: boolean;
}

export default function ChallengeActionButton({ 
    title = "Join", 
    onJoin, 
    onCancel,
    showJoinButton = true,
    showCancelButton = true
}: ChallengeActionButtonProps) {
    return (
        <View className="flex-row items-center gap-2">
            {showJoinButton && <Button title={title} onPress={onJoin} variant="primary" size="sm" />}
            {showCancelButton && <Icon icon={XMarkIcon} onPress={onCancel} />}
        </View>
    )
}


