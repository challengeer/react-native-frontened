import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import { PencilIcon, CheckIcon } from "react-native-heroicons/outline";
import Icon from "@/components/common/Icon";

interface PhotoTextOverlayProps {
    text: string;
    setText: (text: string) => void;
    textPosition: number;
    setTextPosition: (position: number) => void;
    isAddingText: boolean;
    setIsAddingText: (isAdding: boolean) => void;
    keyboardHeight: number;
}

export default function PhotoTextOverlay({
    text,
    setText,
    textPosition,
    setTextPosition,
    isAddingText,
    setIsAddingText,
    keyboardHeight
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

    return (
        <TouchableWithoutFeedback onPress={() => {
            if (isAddingText) {
                setIsAddingText(false);
            }
        }}>
            <View className="flex-1">
                {isAddingText && (
                    <View className="absolute left-0 right-0 w-full" style={{ bottom: keyboardHeight }}>
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
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setIsAddingText(true)}>
                            <View className="bg-black/50">
                                <Text className="text-white text-3xl font-bold text-center px-4 py-4">
                                    {text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

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
        </TouchableWithoutFeedback>
    );
} 