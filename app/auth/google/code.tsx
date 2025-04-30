import i18n from "@/i18n";
import React, { useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useAuth } from "@/components/context/AuthProvider";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import VerificationInput from "@/components/register/VerificationInput";

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
      setError(i18n.t('auth.google.verification.code.error.required'));
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
      setError(i18n.t('auth.google.verification.code.error.verificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
      >
        <Header
          title={i18n.t('auth.google.verification.code.header')}
          leftSection={
            <IconCircle
              icon={ArrowLeftIcon}
              onPress={() => router.back()}
            />
          }
        />

        <View className="flex-1 px-4 pb-4 justify-between">
          <View className="gap-4">
            <VerificationInput
              value={code}
              onChange={setCode}
              onComplete={handleVerify}
              phoneNumber={phoneNumber}
            />

            {error && (
              <Text type="error" className="text-base">{error}</Text>
            )}
          </View>

          <Button
            title={i18n.t('auth.google.verification.code.verify')}
            size="lg"
            onPress={handleVerify}
            disabled={code.length !== 6 || isLoading}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 