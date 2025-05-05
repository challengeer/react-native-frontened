import { View } from "react-native";
import { CheckIcon } from "react-native-heroicons/outline";
import Icon from "@/components/common/Icon";

export default function Checkbox({ checked }: { checked: boolean }) {
    return (
        <View className={`
            w-7 h-7 items-center justify-center rounded-md
            ${checked ? "bg-primary-500 border-0" : "border-2 border-neutral-300 dark:border-neutral-600"}
        `}>
            {checked && <Icon icon={CheckIcon} size={20} strokeWidth={2.5} lightColor="white" darkColor="white" />}
        </View>
    );
}