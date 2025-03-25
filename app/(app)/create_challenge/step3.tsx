import { View, ScrollView } from "react-native";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import UserItem from "@/components/common/UserItem";
import { useState } from "react";
import { router } from "expo-router";

interface Step3Props {
    onCreateChallenge: () => Promise<string | null>;
    isLoading: boolean;
    error?: string;
}

export default function Step3({ onCreateChallenge, isLoading, error }: Step3Props) {
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [localError, setLocalError] = useState("");
    const [inviting, setInviting] = useState(false);

    const { data: friends, isPending } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const response = await api.get("/friends/list");
            return response.data;
        },
    });

    const toggleFriendSelection = (userId: string) => {
        setSelectedFriends(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        setInviting(true);
        setLocalError("");
        
        try {
            // First create the challenge
            const challengeId = await onCreateChallenge();
            
            if (!challengeId) {
                setLocalError("Failed to create challenge");
                return;
            }

            // Then invite friends if any are selected
            if (selectedFriends.length > 0) {
                await api.post("/challenges/invite", {
                    challenge_id: challengeId,
                    receiver_ids: selectedFriends,
                });
            }

            // Navigate back to challenges
            router.push("/(app)/(tabs)/challenges");
        } catch (err) {
            setLocalError("Failed to invite friends. Please try again.");
            console.error("Error in challenge creation/invitation:", err);
        } finally {
            setInviting(false);
        }
    };

    return (
        <View className="flex-1">
            <Text className="text-2xl font-bold px-4 mb-4 mt-6">Invite friends</Text>

            {(error || localError) && (
                <Text className="text-red-500 mb-4">{error || localError}</Text>
            )}

            <ScrollView className="flex-1 -mx-4 px-4">
                {isPending ? (
                    <Text>Loading friends...</Text>
                ) : (
                    friends?.map((friend: any, index: number) => (
                        <UserItem
                            key={friend.user_id}
                            index={index}
                            userId={friend.user_id}
                            title={friend.display_name}
                            subtitle={`@${friend.username}`}
                            name={friend.display_name}
                            profilePicture={friend.profile_picture}
                            rightSection={
                                <Button
                                    size="sm"
                                    variant={selectedFriends.includes(friend.user_id) ? "primary" : "secondary"}
                                    title={selectedFriends.includes(friend.user_id) ? "Selected" : "Select"}
                                    onPress={() => toggleFriendSelection(friend.user_id)}
                                />
                            }
                        />
                    ))
                )}
            </ScrollView>

            <View className="p-4">
                <Button
                    size="lg"
                    title={isLoading || inviting ? "Creating..." : "Create Challenge"}
                    onPress={handleSubmit}
                    disabled={isLoading || inviting || selectedFriends.length === 0}
                />
            </View>
        </View>
    );
}   
