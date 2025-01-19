import Icon, { ThemedIconProps } from "@/components/Icon";

export default function IconCircle(props: ThemedIconProps) {
    return (
        <Icon {...props} className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800" />
    )
}