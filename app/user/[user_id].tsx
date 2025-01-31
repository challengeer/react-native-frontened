import Text from "@/components/Text";
import { useLocalSearchParams } from "expo-router";

export default function UserPage() {
    const { user_id } = useLocalSearchParams<{ user_id: string }>();

    return (
        <Text>User: {user_id}</Text>
    )
}