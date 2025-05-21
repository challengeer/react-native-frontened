import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

interface Overlay {
    type: 'text';
    content: string;
    x: number;
    y: number;
}

interface ImageWithTextProps {
    imageUrl: string;
    overlays?: Overlay[];
}

export default function ImageWithText({
    imageUrl,
    overlays = [],
}: ImageWithTextProps) {
    return (
        <View className="relative">
            <ExpoImage
                source={{ uri: imageUrl }}
                className="w-full h-full rounded-3xl"
                contentFit="cover"
            />
            
            {overlays.map((overlay, index) => (
                overlay.type === 'text' && (
                    <View 
                        key={index}
                        className="absolute w-full"
                        style={{ 
                            left: `${overlay.x * 100}%`,
                            top: `${overlay.y * 100}%`,
                            transform: [{ translateX: -50 }, { translateY: -50 }]
                        }}
                    >
                        <View className="bg-black/50">
                            <Text 
                                className="text-white text-3xl font-bold text-center px-4 py-4"
                                style={{ fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' }}
                            >
                                {overlay.content}
                            </Text>
                        </View>
                    </View>
                )
            ))}
        </View>
    );
} 