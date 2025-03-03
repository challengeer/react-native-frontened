import { useRef, useState } from "react";
import { FlashMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Button, Pressable, Text, View, Image, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon, BoltIcon, BoltSlashIcon, ArrowPathIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@/components/common/Icon";

export default function CameraPage() {
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [uri, setUri] = useState<string | null>(null);
    const [facing, setFacing] = useState<CameraType>("back");
    const [flash, setFlash] = useState<FlashMode>("off");

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <Text className="text-center">
                    We need your permission to use the camera
                </Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }

    const takePicture = async () => {
        const photo = await cameraRef.current?.takePictureAsync();
        setUri(photo?.uri || null);
    };

    const toggleFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        setFlash((prev) => (prev === "off" ? "on" : "off"));
    };

    const renderPicture = () => {
        return (
            <View>
                <Image
                    source={{ uri: uri || "" }}
                    className="w-[300px] h-[300px]"
                />
                <Button onPress={() => setUri(null)} title="Take another picture" />
            </View>
        );
    };

    const renderCamera = () => {
        return (
            <CameraView
                ref={cameraRef}
                facing={facing}
                flash={flash}
                style={{ flex: 1, width: "100%", height: "100%", borderRadius: 24 }}
            >
                <View className="flex-1 justify-between">
                    <LinearGradient colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}>
                        <View className="p-6 flex-row items-center justify-between">
                            <Icon icon={XMarkIcon} lightColor="#fff" darkColor="#fff" onPress={() => router.back()} />

                            <View className="flex-row gap-6">
                                <Icon icon={flash === "off" ? BoltSlashIcon : BoltIcon} lightColor="#fff" darkColor="#fff" onPress={toggleFlash} />
                                <Icon icon={ArrowPathIcon} lightColor="#fff" darkColor="#fff" onPress={() => toggleFacing()} />
                            </View>
                        </View>
                    </LinearGradient>

                    <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.25)"]}>
                        <View className="w-full items-center justify-center p-6">
                            <Pressable
                                onPress={takePicture}
                                className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
                            >
                                <View className="w-16 h-16 rounded-full bg-white" />
                            </Pressable>
                        </View>
                    </LinearGradient>
                </View>
            </CameraView>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-black justify-center items-center">
            <StatusBar barStyle="light-content" />
            {uri ? renderPicture() : renderCamera()}
        </SafeAreaView>
    );
}