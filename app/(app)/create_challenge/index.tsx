import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import CreateChallengeHeader from "@/components/create_challenge/CreateChallengeHeader";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import api from "@/lib/api";

export default function CreateChallenge() {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{name: string, emoji: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const handleCreateChallenge = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/challenges/create", {
        title,
        description,
        emoji: selectedCategory?.emoji,
        category: selectedCategory?.name,
      });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      return response.data.challenge_id;
    } catch (err) {
      setError("Failed to create challenge. Please try again.");
      console.error("Error creating challenge:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <CreateChallengeHeader currentStep={currentStep} onBack={handleBack} />
      <View className="flex-1">
        {currentStep === 1 && (
          <Step1
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <Step2
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            onNext={handleNext}
          />
        )}
        {currentStep === 3 && (
          <Step3
            onCreateChallenge={handleCreateChallenge}
            isLoading={isLoading}
            error={error}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
