import i18n from "@/i18n";
import api from "@/lib/api";
import { useState } from "react";
import { View, ActivityIndicator, FlatList } from "react-native";
import { useFriends } from "@/hooks/useFriends";
import { router } from "expo-router";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import UserItem from "@/components/common/UserItem";
import Checkbox from "@/components/common/Checkbox";

interface Step3Props {
    onCreateChallenge: () => Promise<string | null>;
    isLoading: boolean;
    error?: string;
}

export default function Step3({ onCreateChallenge, isLoading, error }: Step3Props) {
    const { friends, isFriendsLoading, isFriendsError } = useFriends();
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [localError, setLocalError] = useState("");
    const [inviting, setInviting] = useState(false);

    const toggleFriendSelection = (userId: string) => {
        setSelectedFriends(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <UserItem
            index={index}
            userId={item.user_id}
            title={item.display_name}
            subtitle={`@${item.username}`}
            name={item.display_name}
            profilePicture={item.profile_picture}
            onPress={() => toggleFriendSelection(item.user_id)}
            rightSection={
                <Checkbox
                    checked={selectedFriends.includes(item.user_id)}
                />
            }
        />
    );

    const keyExtractor = (item: any) => item.user_id;

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
            <Text className="text-2xl font-bold px-4 mb-4 mt-6">{i18n.t("create_challenge.step3.title")}</Text>

            {(error || localError || isFriendsError) && (
                <Text className="text-red-500 text-center text-lg pt-16">{error || localError || isFriendsError}</Text>
            )}

            {isFriendsLoading ? (
                <ActivityIndicator className="flex-1 items-center justify-center" size="large" color="#a855f7" />
            ) : (
                <FlatList
                    data={friends}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    overScrollMode="never"
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                    contentContainerClassName="pb-48"
                    keyboardShouldPersistTaps="handled"
                />
            )}

            <View className="p-4">
                <Button
                    size="lg"
                    title={isLoading || inviting ? i18n.t("create_challenge.step3.loading") : i18n.t("create_challenge.step3.create_challenge")}
                    onPress={handleSubmit}
                    disabled={isLoading || inviting || selectedFriends.length === 0}
                />
            </View>
        </View>
    );
}   
