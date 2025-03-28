import { View } from "react-native";
import { CheckIcon } from "react-native-heroicons/outline";
import Icon from "@/components/common/Icon";

export default function Checkbox({ checked }: { checked: boolean }) {
    return (
        <View className={`
            w-7 h-7 items-center justify-center rounded-md
            ${checked ? "bg-primary-500 border-0" : "border-[1.5px] border-neutral-100 dark:border-neutral-800"}
        `}>
            {checked && <Icon icon={CheckIcon} size={20} lightColor="white" darkColor="white" />}
        </View>
    );
}