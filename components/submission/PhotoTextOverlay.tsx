import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Dimensions, TouchableWithoutFeedback, Pressable, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from "react-native-heroicons/outline";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";

interface PhotoTextOverlayProps {
    text: string;
    setText: (text: string) => void;
    textPosition: number;
    setTextPosition: (position: number) => void;
    isAddingText: boolean;
    setIsAddingText: (isAdding: boolean) => void;
    keyboardHeight: number;
    uri: string | null;
    onDiscard: () => void;
    onSubmit: () => void;
    isUploading: boolean;
}

export default function PhotoTextOverlay({
    text,
    setText,
    textPosition,
    setTextPosition,
    isAddingText,
    setIsAddingText,
    keyboardHeight,
    uri,
    onDiscard,
    onSubmit,
    isUploading
}: PhotoTextOverlayProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startPosition, setStartPosition] = useState(0.5);

    const handleTouchStart = (e: any) => {
        setIsDragging(true);
        setStartY(e.nativeEvent.pageY);
        setStartPosition(textPosition);
    };

    const handleTouchMove = (e: any) => {
        if (!isDragging) return;

        const screenHeight = Dimensions.get('window').height;
        const deltaY = e.nativeEvent.pageY - startY;
        const newPosition = Math.max(0.06, Math.min(0.82, startPosition + (deltaY / screenHeight)));
        setTextPosition(newPosition);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    if (!uri) return null;

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <View className="flex-1 relative">
                <Image
                    source={{ uri }}
                    style={{ width: "100%", height: "100%", borderRadius: 24 }}
                    contentFit="cover"
                />

                <View className="absolute inset-0">
                    {isAddingText && (
                        <Pressable
                            className="absolute inset-0"
                            onPress={() => setIsAddingText(false)}
                        >
                            <View className="absolute mb-6 left-0 right-0 w-full" style={{ bottom: keyboardHeight }}>
                                <View className="bg-black/50 w-full">
                                    <TextInput
                                        value={text}
                                        onChangeText={(newText) => {
                                            const cleanText = newText.replace(/\n/g, '').slice(0, 30);
                                            setText(cleanText);
                                        }}
                                        placeholder="Add text..."
                                        placeholderTextColor="#999"
                                        className="text-white text-xl text-center px-4 py-2"
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
                        </Pressable>
                    )}

                    {!isAddingText && text && (
                        <View
                            className="absolute left-0 right-0 w-full"
                            style={{ top: `${textPosition * 100}%` }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <TouchableOpacity activeOpacity={0.7} onPress={() => setIsAddingText(true)}>
                                <View className="bg-black/50">
                                    <Text className="text-white text-xl text-center px-4 py-2">
                                        {text}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <LinearGradient
                    colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                    style={{ position: "absolute", top: 0, left: 0, right: 0 }}
                >
                    <View className="p-6 flex-row items-center justify-between">
                        <Icon
                            icon={XMarkIcon}
                            lightColor="#fff"
                            darkColor="#fff"
                            onPress={onDiscard}
                        />
                        {!isAddingText && (
                            <Icon
                                icon={PencilIcon}
                                lightColor="#fff"
                                darkColor="#fff"
                                onPress={() => setIsAddingText(true)}
                            />
                        )}
                        {isAddingText && (
                            <Icon
                                icon={CheckIcon}
                                lightColor="#fff"
                                darkColor="#fff"
                                onPress={() => setIsAddingText(false)}
                            />
                        )}
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
                                onPress={onSubmit}
                            />
                        </View>
                    </LinearGradient>
                )}
            </View>
        </KeyboardAvoidingView>
    );
} 