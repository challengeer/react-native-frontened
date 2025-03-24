import Icon, { ThemedIconProps } from "@/components/common/Icon";

export default function IconCircle(props: ThemedIconProps) {
    return (
        <Icon
            onPress={props.onPress}
            className="w-12 h-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
            {...props}
        />
    )
}