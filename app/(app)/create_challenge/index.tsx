import api from "@/lib/api";
import { useState } from "react";
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@/components/common/Text";
import UserInterface from "@/types/UserInterface";
import CreateChallengeHeader from "@/components/create_challenge/CreateChallengeHeader";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import UserItem from "@/components/common/UserItem";

export default function CreateChallenge() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/challenges/create", {
        title,
        description,
        emoji: "🏃‍♂️",
        category: "Running",
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
                        className={`px-4 py-2 rounded-md ${selectedFriends.includes(user.user_id)
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
                  className={`w-full bg-blue-600 py-2 px-4 rounded-md mt-4 ${(isLoading || selectedFriends.length === 0) ? "opacity-50" : ""
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
      <CreateChallengeHeader currentStep={currentStep} onBack={handleBack} />
      <ScrollView className="flex-1 px-4">
        {currentStep === 1 && (
          <Step1
            title={title}
            setTitle={setTitle}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <Step2
            description={description}
            setDescription={setDescription}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <Step3
            onSubmit={handleSubmit}
            onBack={handleBack}
            isLoading={isLoading}
            error={error}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
