import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import api from "@/lib/api";

export default function CreateChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      await api.post("/challenges/create", {
        title,
        description,
        start_date: new Date().toISOString(),
      });
      router.push("/(app)/(tabs)/challenges"); // Redirect to home page after successful creation
    } catch (err) {
      setError("Failed to create challenge. Please try again.");
      console.error("Error creating challenge:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
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
  );
}
