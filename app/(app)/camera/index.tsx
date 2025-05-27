import { useRef, useState, useEffect } from "react";
import { FlashMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Pressable, Text, View, StatusBar, Keyboard, Platform, Linking } from "react-native";
import { FlipType, ImageManipulator, SaveFormat, useImageManipulator } from "expo-image-manipulator";
import { LinearGradient } from "expo-linear-gradient";
import { XMarkIcon, BoltIcon, BoltSlashIcon, ArrowPathIcon } from "react-native-heroicons/outline";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { Overlay } from "@/types/submission";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import PhotoTextOverlay from "@/components/submission/PhotoTextOverlay";
import api from "@/lib/api";

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

    const context = useImageManipulator(state.uri ?? "");

    const takePicture = async () => {
        const photo = await cameraRef.current?.takePictureAsync();

        if (!photo?.uri) {
            console.error('No photo URI received');
            return;
        }

        if (state.facing === "front") {
            const context = ImageManipulator.manipulate(photo.uri);
            context.flip(FlipType.Horizontal);
            const image = await context.renderAsync();
            const result = await image.saveAsync({
                format: SaveFormat.JPEG,
            });
            photo.uri = result.uri;
        }

        setState(prev => ({ ...prev, uri: photo.uri }));
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

            if (state.text) {
                const overlay: Overlay = {
                    overlay_type: 'text',
                    content: state.text,
                    x: 0.5,
                    y: state.textPosition
                };

                formData.append('overlays', JSON.stringify([overlay]));
            }

            const response = await api.post(`/challenges/${challenge_id}/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                queryClient.refetchQueries({ queryKey: ['submissions', challenge_id] });
                router.replace(`/(app)/(tabs)/challenges`);
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
                <Text className="text-center text-white mb-4">We need your permission to use the camera</Text>
                {permission.canAskAgain ? (
                    <Button onPress={requestPermission} title="Grant permission" />
                ) : (
                    <Button
                        onPress={() => Linking.openSettings()}
                        title="Open Settings"
                    />
                )}
            </View>
        );
    }

    const renderPicture = () => (
        <PhotoTextOverlay
            text={state.text}
            setText={(text) => setState(prev => ({ ...prev, text }))}
            textPosition={state.textPosition}
            setTextPosition={(position) => setState(prev => ({ ...prev, textPosition: position }))}
            isAddingText={state.isAddingText}
            setIsAddingText={(isAdding) => setState(prev => ({ ...prev, isAddingText: isAdding }))}
            keyboardHeight={keyboardHeight}
            uri={state.uri}
            onDiscard={() => setState(prev => ({
                ...prev,
                uri: null,
                text: "",
                isAddingText: false,
                textPosition: 0.5
            }))}
            onSubmit={handleSubmit}
            isUploading={state.isUploading}
        />
    );

    const renderCamera = () => (
        <CameraView
            ref={cameraRef}
            facing={state.facing}
            flash={state.flash}
            ratio="16:9"
            pictureSize="1080p"
            style={{ width: "100%", aspectRatio: 9 / 16 }}
            animateShutter={false}
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
            {state.uri ? renderPicture() : renderCamera()}
        </View>
    );
}