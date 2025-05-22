import { useRef, useState, useEffect } from "react";
import { FlashMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Pressable, Text, View, StatusBar, Keyboard, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon, BoltIcon, BoltSlashIcon, ArrowPathIcon } from "react-native-heroicons/outline";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import * as ImageManipulator from 'expo-image-manipulator';
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import PhotoTextOverlay from "@/components/submission/PhotoTextOverlay";
import api from "@/lib/api";
import { Overlay } from "@/types/submission";

interface CameraState {
    uri: string | null;
    facing: CameraType;
    flash: FlashMode;
    isUploading: boolean;
    text: string;
    isAddingText: boolean;
    textPosition: number;
    isDragging: boolean;
    startY: number;
    startPosition: number;
    hasMoved: boolean;
    initialTouchY: number;
    keyboardHeight: number;
    isProcessing: boolean;
}

const useKeyboardHeight = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    return keyboardHeight;
};

const CameraControls = ({ flash, onFlashToggle, onFacingToggle }: { 
    flash: FlashMode; 
    onFlashToggle: () => void; 
    onFacingToggle: () => void;
}) => (
    <View className="flex-row gap-6">
        <Icon 
            icon={flash === "off" ? BoltSlashIcon : BoltIcon} 
            lightColor="#fff" 
            darkColor="#fff" 
            onPress={onFlashToggle} 
        />
        <Icon 
            icon={ArrowPathIcon} 
            lightColor="#fff" 
            darkColor="#fff" 
            onPress={onFacingToggle} 
        />
    </View>
);

const CameraCaptureButton = ({ onCapture }: { onCapture: () => void }) => (
    <Pressable
        onPress={onCapture}
        className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
    >
        <View className="w-16 h-16 rounded-full bg-white" />
    </Pressable>
);

export default function CameraPage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const queryClient = useQueryClient();
    const insets = useSafeAreaInsets();
    const keyboardHeight = useKeyboardHeight();

    const [state, setState] = useState<CameraState>({
        uri: null,
        facing: "back",
        flash: "off",
        isUploading: false,
        text: "",
        isAddingText: false,
        textPosition: 0.5,
        isDragging: false,
        startY: 0,
        startPosition: 0.5,
        hasMoved: false,
        initialTouchY: 0,
        keyboardHeight: 0,
        isProcessing: false
    });

    const handleTouchStart = (e: any) => {
        setState(prev => ({
            ...prev,
            isDragging: true,
            startY: e.nativeEvent.pageY,
            startPosition: prev.textPosition
        }));
    };

    const handleTouchMove = (e: any) => {
        if (!state.isDragging) return;
        
        const screenHeight = Dimensions.get('window').height;
        const deltaY = e.nativeEvent.pageY - state.startY;
        const newPosition = Math.max(0.06, Math.min(0.82, state.startPosition + (deltaY / screenHeight)));
        
        setState(prev => ({ ...prev, textPosition: newPosition }));
    };

    const handleTouchEnd = () => {
        setState(prev => ({ ...prev, isDragging: false }));
    };

    const takePicture = async () => {
        const photo = await cameraRef.current?.takePictureAsync({ 
            skipProcessing: true,
            quality: 0.7,
            exif: true
        });

        if (!photo?.uri) {
            console.error('No photo URI received');
            return;
        }

        // Only set processing state after we have the photo
        setState(prev => ({ ...prev, isProcessing: true }));
        
        // Get the original dimensions from the photo object
        const { width, height } = photo;
        
        // Calculate new dimensions maintaining aspect ratio
        let newWidth = 1080;
        let newHeight = 1920;
        
        if (width > height) {
            // Landscape orientation
            newWidth = 1920;
            newHeight = Math.round((1920 * height) / width);
        } else {
            // Portrait orientation
            newHeight = 1920;
            newWidth = Math.round((1920 * width) / height);
        }

        try {
            // Process the image to fix rotation and resize
            const processedImage = await ImageManipulator.manipulateAsync(
                photo.uri,
                [
                    ...(state.facing === "front" ? [{ flip: ImageManipulator.FlipType.Horizontal }] : []),
                    { resize: { width: newWidth, height: newHeight } },
                ],
                {
                    compress: 0.7,
                    format: ImageManipulator.SaveFormat.JPEG
                }
            );

            setState(prev => ({ 
                ...prev, 
                uri: processedImage.uri,
                isProcessing: false 
            }));
        } catch (error) {
            console.error('Error processing image:', error);
            setState(prev => ({ ...prev, isProcessing: false }));
        }
    };

    const toggleFacing = () => {
        setState(prev => ({ ...prev, facing: prev.facing === "back" ? "front" : "back" }));
    };

    const toggleFlash = () => {
        setState(prev => ({ ...prev, flash: prev.flash === "off" ? "on" : "off" }));
    };

    const handleSubmit = async () => {
        if (!state.uri) return;
        setState(prev => ({ ...prev, isUploading: true }));

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: state.uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            } as any);
            
            const overlay: Overlay = {
                overlay_type: 'text',
                content: state.text,
                x: 0.5,
                y: state.textPosition
            };
            
            formData.append('overlays', JSON.stringify([overlay]));

            const response = await api.post(`/challenges/${challenge_id}/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                queryClient.refetchQueries({ queryKey: ['submissions', challenge_id] });
                router.push(`/(app)/(tabs)/challenges`);
            }
        } catch (error: any) {
            console.error('Error uploading file:', error.response.data);
        } finally {
            setState(prev => ({ ...prev, isUploading: false }));
        }
    };

    if (!permission) return null;

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <Text className="text-center">We need your permission to use the camera</Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }

    const renderPicture = () => (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <View className="flex-1 relative">
                <Image
                    source={{ uri: state.uri || "" }}
                    style={{ width: "100%", height: "100%", borderRadius: 24 }}
                    contentFit="cover"
                />

                <PhotoTextOverlay
                    text={state.text}
                    setText={(text) => setState(prev => ({ ...prev, text }))}
                    textPosition={state.textPosition}
                    setTextPosition={(position) => setState(prev => ({ ...prev, textPosition: position }))}
                    isAddingText={state.isAddingText}
                    setIsAddingText={(isAdding) => setState(prev => ({ ...prev, isAddingText: isAdding }))}
                    keyboardHeight={keyboardHeight}
                />

                <LinearGradient
                    colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                    style={{ position: "absolute", top: 0, left: 0, right: 0 }}
                >
                    <View className="p-6 flex-row items-center justify-between">
                        <Icon
                            icon={XMarkIcon}
                            lightColor="#fff"
                            darkColor="#fff"
                            onPress={() => setState(prev => ({
                                ...prev,
                                uri: null,
                                text: "",
                                isAddingText: false,
                                textPosition: 0.5
                            }))}
                        />
                    </View>
                </LinearGradient>

                {!state.isAddingText && (
                    <LinearGradient
                        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.25)"]}
                        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                    >
                        <View className="justify-center items-center p-6">
                            <Button
                                title="Submit photo"
                                size="lg"
                                loading={state.isUploading}
                                disabled={state.isUploading}
                                onPress={handleSubmit}
                            />
                        </View>
                    </LinearGradient>
                )}
            </View>
        </KeyboardAvoidingView>
    );

    const renderCamera = () => (
        <CameraView
            ref={cameraRef}
            facing={state.facing}
            flash={state.flash}
            ratio="16:9"
            pictureSize="1080p"
            style={{ width: "100%", height: "100%", borderRadius: 24 }}
        >
            <View className="flex-1 justify-between">
                <LinearGradient colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}>
                    <View className="p-6 flex-row items-center justify-between">
                        <Icon 
                            icon={XMarkIcon} 
                            lightColor="#fff" 
                            darkColor="#fff" 
                            onPress={() => router.back()} 
                        />
                        <CameraControls 
                            flash={state.flash}
                            onFlashToggle={toggleFlash}
                            onFacingToggle={toggleFacing}
                        />
                    </View>
                </LinearGradient>

                <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.25)"]}>
                    <View className="w-full items-center justify-center p-6">
                        <CameraCaptureButton onCapture={takePicture} />
                    </View>
                </LinearGradient>
            </View>
        </CameraView>
    );

    return (
        <View className="flex-1 bg-black" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <StatusBar barStyle="light-content" />
            {state.isProcessing ? (
                <View className="flex-1 bg-black" />
            ) : (
                state.uri ? renderPicture() : renderCamera()
            )}
        </View>
    );
}