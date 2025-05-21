import i18n from '@/i18n';
import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/common/Button';
import GoogleIcon from '@/components/icons/GoogleIcon';

export default function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      variant="secondary"
      title={i18n.t('auth.google.signIn')}
      onPress={handleGoogleSignIn}
      leftSection={<GoogleIcon />}
      loading={isLoading}
    />
  );
} 