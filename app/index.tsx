import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FirstPage() {
  useEffect(() => {
    const checkAuth = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) router.replace("/challenges");
      else router.replace("/auth");
    };

    checkAuth();
  }, [])

  return null
}