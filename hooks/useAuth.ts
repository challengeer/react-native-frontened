import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        try {
            const token = await SecureStore.getItemAsync("access_token");
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error("Error checking auth status:", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return {
        isAuthenticated,
        isLoading
    };
};