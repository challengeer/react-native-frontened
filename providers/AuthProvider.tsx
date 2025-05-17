import api from '@/lib/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { UserPrivateInterface } from '@/types/UserInterface';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { getFCMToken } from '@/lib/notifications';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
    PhoneAuthProvider,
    signInWithPhoneNumber,
} from '@react-native-firebase/auth';

interface AuthContextType {
    user: UserPrivateInterface | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signInWithGoogle: () => Promise<void>;
    submitPhoneNumber: (phoneNumber: string) => Promise<string>;
    confirmPhoneVerification: (verificationId: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserPrivateInterface | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const auth = getAuth();

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchUserProfile = async (retryCount = 0, maxRetries = 3) => {
        try {
            const response = await api.get('/user/me');
            if (response.status === 200) {
                setUser(response.data);
                return;
            }
            throw new Error('Failed to fetch user profile');
        } catch (error) {
            console.error(`Error fetching user profile (attempt ${retryCount + 1}/${maxRetries}):`, error);
            
            if (retryCount < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
                console.log(`Retrying in ${delay}ms...`);
                await sleep(delay);
                return fetchUserProfile(retryCount + 1, maxRetries);
            }
            
            await logout();
        }
    };

    useEffect(() => {
        // Initialize Google Sign-In
        GoogleSignin.configure({
            webClientId: '344827725651-ivr0t9hj2mjvrarj6nuq41vjlsfb7ici.apps.googleusercontent.com',
        });
    }, []);

    const submitPhoneNumber = async (phoneNumber: string): Promise<string> => {
        try {
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
            return confirmation.verificationId || '';
        } catch (error) {
            console.error('Phone verification error:', error);
            throw error;
        }
    };

    const confirmPhoneVerification = async (verificationId: string, code: string): Promise<void> => {
        try {
            const credential = PhoneAuthProvider.credential(verificationId, code);
            await auth.currentUser?.linkWithCredential(credential);
            const firebaseToken = await auth.currentUser?.getIdToken();

            if (!firebaseToken) {
                throw new Error('No Firebase token received');
            }

            const fcmToken = await getFCMToken();

            const result = await api.post('/auth/google', { 
                id_token: firebaseToken,
                fcm_token: fcmToken,
            });

            if (result.status !== 200) {
                throw new Error(result.data.detail || 'Authentication failed');
            }

            await SecureStore.setItemAsync('access_token', result.data.access_token);
            await SecureStore.setItemAsync('refresh_token', result.data.refresh_token);

            setIsAuthenticated(true);
            await fetchUserProfile();
        } catch (error) {
            console.error('Phone verification confirmation error:', error);
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            // Get the users ID token
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            const { idToken } = await GoogleSignin.getTokens();

            if (!idToken) {
                throw new Error('No ID token received');
            }

            // Sign in with Google
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
            const firebaseToken = await auth.currentUser?.getIdToken();

            if (!firebaseToken) {
                throw new Error('No Firebase token received');
            }

            // Get FCM token
            const fcmToken = await getFCMToken();

            // Get device information
            const deviceInfo = {
                brand: Device.brand,
                model_name: Device.modelName,
                os_name: Device.osName,
                os_version: Device.osVersion,
            };

            // Send Firebase token and device info to the backend
            const result = await api.post('/auth/google', { 
                id_token: firebaseToken,
                fcm_token: fcmToken,
                ...deviceInfo
            });

            await SecureStore.setItemAsync('access_token', result.data.access_token);
            await SecureStore.setItemAsync('refresh_token', result.data.refresh_token);
            
            setIsAuthenticated(true);
            await fetchUserProfile();
            router.replace('/(app)/(tabs)/challenges');
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                return router.push('/auth/google');
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            await GoogleSignin.signOut();
            const fcmToken = await getFCMToken();
            await api.post('/auth/logout', { fcm_token: fcmToken });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            setUser(null);
            setIsAuthenticated(false);
            queryClient.clear();
            router.replace('/auth');
        }
    };

    const refreshUser = async () => {
        if (isAuthenticated) {
            await fetchUserProfile();
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('access_token');
                if (token) {
                    setIsAuthenticated(true);
                    await fetchUserProfile();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated,
            signInWithGoogle,
            submitPhoneNumber,
            confirmPhoneVerification,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 