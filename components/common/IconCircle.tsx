import Icon, { ThemedIconProps } from "@/components/common/Icon";
import { Pressable } from "react-native";

export default function IconCircle(props: ThemedIconProps) {
    return (
        <Pressable onPress={props.onPress} className="w-12 h-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <Icon {...props} />
        </Pressable>
    )
}