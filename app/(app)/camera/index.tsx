import { useRef, useState, useEffect } from "react";
import { FlashMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Pressable, Text, View, StatusBar, TextInput, TouchableOpacity, PanResponder, Keyboard, KeyboardAvoidingView, Platform, Dimensions, Animated } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon, BoltIcon, BoltSlashIcon, ArrowPathIcon, PencilIcon, CheckIcon } from "react-native-heroicons/outline";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import api from "@/lib/api";

export default function CameraPage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [uri, setUri] = useState<string | null>(null);
    const [facing, setFacing] = useState<CameraType>("back");
    const [flash, setFlash] = useState<FlashMode>("off");
    const [isUploading, setIsUploading] = useState(false);
    const [text, setText] = useState("");
    const [isAddingText, setIsAddingText] = useState(false);
    const [textPosition, setTextPosition] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startPosition, setStartPosition] = useState(0.5);
    const [hasMoved, setHasMoved] = useState(false);
    const [initialTouchY, setInitialTouchY] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const queryClient = useQueryClient();

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    const handleTouchStart = (e: any) => {
        setIsDragging(true);
        setStartY(e.nativeEvent.pageY);
        setStartPosition(textPosition);
    };

    const handleTouchMove = (e: any) => {
        if (!isDragging) return;
        
        const screenHeight = Dimensions.get('window').height;
        const deltaY = e.nativeEvent.pageY - startY;
        const newPosition = Math.max(0, Math.min(1, startPosition + (deltaY / screenHeight)));
        setTextPosition(newPosition);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

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

    const handleSubmit = async () => {
        if (!uri) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            } as any);
            formData.append('text', text);
            formData.append('textPosition', textPosition.toString()); 

            const response = await api.post(`/challenges/${challenge_id}/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                queryClient.refetchQueries({ queryKey: ['submissions', challenge_id] });
                router.push(`/(app)/(tabs)/challenges`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle error appropriately
        } finally {
            setIsUploading(false);
        }
    };

    const renderPicture = () => {
        return (
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 relative">
                    <Image
                        source={{ uri: uri || "" }}
                        style={{ width: "100%", height: "100%", borderRadius: 24 }}
                        contentFit="cover"
                    />

                    {isAddingText && (
                        <View className="absolute top-0 left-0 right-0">
                            <View className="bg-black/50 w-full">
                                <TextInput
                                    value={text}
                                    onChangeText={(newText) => {
                                        const cleanText = newText.replace(/\n/g, '').slice(0, 30);
                                        setText(cleanText);
                                    }}
                                    placeholder="Add text..."
                                    placeholderTextColor="#999"
                                    className="text-white text-3xl font-bold text-center px-4 py-4"
                                    style={{ fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' }}
                                    autoFocus
                                    maxLength={30}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => {
                                        setIsAddingText(false);
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    {!isAddingText && text && (
                        <View 
                            className="absolute left-0 right-0 w-full"
                            style={{ top: `${textPosition * 100}%` }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <View className="bg-black/50">
                                <Text className="text-white text-3xl font-bold text-center px-4 py-4">
                                    {text}
                                </Text>
                            </View>
                        </View>
                    )}

                    <LinearGradient
                        colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
                    >
                        <View className="p-6 flex-row items-center justify-between">
                            <Icon
                                icon={XMarkIcon}
                                lightColor="#fff"
                                darkColor="#fff"
                                onPress={() => {
                                    setUri(null);
                                    setText("");
                                    setIsAddingText(false);
                                    setTextPosition(0.5);
                                }}
                            />
                            <View className="flex-row gap-4">
                                {!isAddingText && (
                                    <Icon
                                        icon={PencilIcon}
                                        lightColor="#fff"
                                        darkColor="#fff"
                                        onPress={() => {
                                            setIsAddingText(true);
                                        }}
                                    />
                                )}
                                {isAddingText && (
                                    <Icon
                                        icon={CheckIcon}
                                        lightColor="#fff"
                                        darkColor="#fff"
                                        onPress={() => {
                                            setIsAddingText(false);
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                    </LinearGradient>

                    {!isAddingText && (
                        <LinearGradient
                            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.25)"]}
                            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                        >
                            <View className="justify-center items-center p-6">
                                <Button
                                    title="Submit photo"
                                    size="lg"
                                    loading={isUploading}
                                    disabled={isUploading}
                                    onPress={handleSubmit}
                                />
                            </View>
                        </LinearGradient>
                    )}
                </View>
            </KeyboardAvoidingView>
        );
    };

    const renderCamera = () => {
        return (
            <CameraView
                ref={cameraRef}
                facing={facing}
                flash={flash}
                style={{ width: "100%", height: "100%", borderRadius: 24 }}
            >
                <View className="flex-1 justify-between">
                    <LinearGradient colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}>
                        <View className="p-6 flex-row items-center justify-between">
                            <Icon icon={XMarkIcon} lightColor="#fff" darkColor="#fff" onPress={() => router.back()} />

                            <View className="flex-row gap-6">
                                <Icon icon={flash === "off" ? BoltSlashIcon : BoltIcon} lightColor="#fff" darkColor="#fff" onPress={toggleFlash} />
                                <Icon icon={ArrowPathIcon} lightColor="#fff" darkColor="#fff" onPress={toggleFacing} />
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
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />
            {uri ? renderPicture() : renderCamera()}
        </SafeAreaView>
    );
}