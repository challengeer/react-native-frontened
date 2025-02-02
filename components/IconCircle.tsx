import Icon, { ThemedIconProps } from "@/components/Icon";
import { Pressable } from "react-native";

export default function IconCircle(props: ThemedIconProps) {
    return (
        <Pressable onPress={props.onPress} className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
            <Icon {...props} />
        </Pressable>
    )
}