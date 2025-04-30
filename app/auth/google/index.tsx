import i18n from "@/i18n";
import React, { useState } from "react";
import { View, KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useAuth } from "@/components/context/AuthProvider";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";
import Text from "@/components/common/Text";
import PhoneInput from "@/components/register/PhoneInput";

export default function PhoneVerificationPage() {
  const { submitPhoneNumber } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);

  const handleChange = (text: string) => {
    setPhoneNumber(text);
    const digitsOnly = text.replace(/\D/g, '');
    const isValid = digitsOnly.length >= 10;
    setIsValidPhone(isValid);
  }

  const handleContinue = async () => {
    if (!phoneNumber) {
      setError(i18n.t('auth.google.verification.error.required'));
      return;
    }

    if (!isValidPhone) {
      setError(i18n.t('auth.google.verification.error.invalidPhone'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const verificationId = await submitPhoneNumber(phoneNumber);

      console.log("Verification ID:", verificationId);

      // Store the verification ID in the route params
      router.push(`/auth/google/code?verificationId=${verificationId}&phoneNumber=${phoneNumber}`);
    } catch (err: any) {
      setError(i18n.t('auth.google.verification.error.verificationFailed'));
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
          title={i18n.t('auth.google.verification.header')}
          leftSection={
            <IconCircle
              icon={ArrowLeftIcon}
              onPress={() => router.back()}
            />
          }
        />

        <View className="flex-1 px-4 py-4 justify-between">
          <View className="gap-4">
            <PhoneInput
              value={phoneNumber}
              onChangeText={handleChange}
            />

            {error && (
              <Text type="error" className="text-base">{error}</Text>
            )}
          </View>

          <Button
            title="Continue"
            size="lg"
            onPress={handleContinue}
            disabled={!phoneNumber || !isValidPhone || isLoading}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 