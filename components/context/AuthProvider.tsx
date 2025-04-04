import api from '@/lib/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { UserPrivateInterface } from '@/types/UserInterface';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { getFCMToken } from '@/lib/notifications';
import * as SecureStore from 'expo-secure-store';
import auth from '@react-native-firebase/auth';

interface AuthContextType {
    user: UserPrivateInterface | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserPrivateInterface | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Initialize Google Sign-In
        GoogleSignin.configure({
            webClientId: '344827725651-ivr0t9hj2mjvrarj6nuq41vjlsfb7ici.apps.googleusercontent.com', // from google-services.json
        });
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/user/me');
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            await logout();
        }
    };

    const signInWithGoogle = async () => {
        try {
            // Get the users ID token
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            const idToken = await GoogleSignin.getTokens();

            if (!idToken.accessToken) {
                throw new Error('No access token received');
            }

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken.accessToken);

            // Sign-in the user with the credential
            const userCredential = await auth().signInWithCredential(googleCredential);
            const firebaseUser = userCredential.user;

            // Get FCM token
            const fcmToken = await getFCMToken();

            // Send both tokens to the backend
            const result = await api.post('/auth/google', { 
                token: await firebaseUser.getIdToken(),
                fcm_token: fcmToken
            });

            if (result.status !== 200) {
                throw new Error(result.data.detail || 'Authentication failed');
            }

            await SecureStore.setItemAsync('access_token', result.data.access_token);
            await SecureStore.setItemAsync('refresh_token', result.data.refresh_token);
            
            setIsAuthenticated(true);
            await fetchUserProfile();
            router.replace('/');
        } catch (error: any) {
            console.error('Authentication error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth().signOut();
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