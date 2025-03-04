import api from "@/lib/api";
import { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@/components/common/Text";
import UserInterface from "@/types/UserInterface";
import UserItem from "@/components/common/UserItem";

export default function CreateChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Reuse the existing friends query
  const { data: friends, isPending } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const response = await api.get("/friends/list");
      return response.data;
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/challenges/create", {
        title,
        description,
        start_date: new Date().toISOString(),
      });
      setChallengeId(response.data.challenge_id);
    } catch (err) {
      setError("Failed to create challenge. Please try again.");
      console.error("Error creating challenge:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteFriends = async () => {
    if (!challengeId || selectedFriends.length === 0) return;
    
    setIsLoading(true);
    try {
      await api.post("/challenges/invite", {
        challenge_id: challengeId,
        receiver_ids: selectedFriends,
      });
      router.push("/(app)/(tabs)/challenges");
    } catch (err) {
      setError("Failed to invite friends. Please try again.");
      console.error("Error inviting friends:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFriendSelection = (userId: string) => {
    setSelectedFriends(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (challengeId) {
    return (
      <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-4">
        <View className="max-w-2xl mx-auto w-full">
          <Text className="text-2xl font-bold mb-6">Invite Friends</Text>
          
          {error ? (
            <View className="bg-red-100 border border-red-400 p-3 rounded mb-4">
              <Text className="text-red-700">{error}</Text>
            </View>
          ) : null}

          {isPending ? (
            <ActivityIndicator className="py-12" size="large" color="#a855f7" />
          ) : (
            <View className="space-y-4">
              {friends?.map((user: UserInterface, index: number) => (
                <UserItem
                  key={user.user_id}
                  index={index}
                  userId={user.user_id}
                  displayName={user.display_name}
                  username={user.username}
                  profilePicture={user.profile_picture}
                  rightSection={
                    <TouchableOpacity
                      onPress={() => toggleFriendSelection(user.user_id)}
                      className={`px-4 py-2 rounded-md ${
                        selectedFriends.includes(user.user_id)
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text className={selectedFriends.includes(user.user_id) ? "text-white" : "text-gray-800"}>
                        {selectedFriends.includes(user.user_id) ? "Selected" : "Select"}
                      </Text>
                    </TouchableOpacity>
                  }
                />
              ))}

              <TouchableOpacity
                onPress={handleInviteFriends}
                disabled={isLoading || selectedFriends.length === 0}
                className={`w-full bg-blue-600 py-2 px-4 rounded-md mt-4 ${
                  (isLoading || selectedFriends.length === 0) ? "opacity-50" : ""
                }`}
              >
                <Text className="text-white text-center font-medium">
                  {isLoading ? "Inviting..." : "Invite Selected Friends"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-4">
        <View className="max-w-2xl mx-auto w-full">
          <Text className="text-2xl font-bold mb-6">Create New Challenge</Text>
          
        {error ? (
          <View className="bg-red-100 border border-red-400 p-3 rounded mb-4">
            <Text className="text-red-700">{error}</Text>
          </View>
        ) : null}

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium mb-1">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter challenge title"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
              placeholder="Enter challenge description"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`w-full bg-blue-600 py-2 px-4 rounded-md ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white text-center font-medium">
              {isLoading ? "Creating..." : "Create Challenge"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
