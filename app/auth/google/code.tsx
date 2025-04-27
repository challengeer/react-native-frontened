import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import VerificationInput from "@/components/register/VerificationInput";
import { useAuth } from "@/components/context/AuthProvider";

export default function VerificationCodePage() {
  const { confirmPhoneVerification } = useAuth();
  const { verificationId, phoneNumber } = useLocalSearchParams<{
    verificationId: string;
    phoneNumber: string;
  }>();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!verificationId || !code) {
      setError("Please enter the verification code");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Verify the phone number with Firebase
      await confirmPhoneVerification(verificationId, code);

      // Navigate to the friends page
      router.replace("/auth/google/friends");
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Header
        title="Verification Code"
        leftSection={
          <IconCircle
            icon={ArrowLeftIcon}
            onPress={() => router.back()}
          />
        }
      />

      <View className="flex-1 px-4 pb-4 justify-between">
        <View className="gap-4">
          <Text className="text-xl font-bold">Enter verification code</Text>
          <Text className="text-base text-neutral-500">
            We've sent a verification code to {phoneNumber}
          </Text>

          <VerificationInput
            value={code}
            onChange={setCode}
          />

          {error && (
            <Text className="text-red-500">{error}</Text>
          )}
        </View>

        <Button
          title="Verify"
          size="lg"
          onPress={handleVerify}
          disabled={code.length !== 6 || isLoading}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
} 