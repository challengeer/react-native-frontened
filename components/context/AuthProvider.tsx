import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { UserPrivateInterface } from '@/types/UserInterface';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '@/lib/api';

// Configure GoogleSignin
GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // Add this for IOS:
    // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

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
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;

            if (!idToken) {
                throw new Error('No ID token received');
            }

            const result = await api.post('/auth/google', { token: idToken });

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
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the sign-in flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Sign-in operation already in progress
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // Play services not available
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await GoogleSignin.signOut();
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            setUser(null);
            setIsAuthenticated(false);
            router.replace('/auth');
        } catch (error) {
            console.error('Logout error:', error);
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