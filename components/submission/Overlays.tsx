import React from 'react';
import { View, Text } from 'react-native';

interface Overlay {
    overlay_id: number;
    overlay_type: 'text';
    content: string;
    x: number;
    y: number;
}

export default function Overlays({ overlays }: { overlays: Overlay[] }) {
    return (
        <>
            {overlays.map((overlay) => (
                overlay.overlay_type === 'text' && (
                    <View
                        key={overlay.overlay_id}
                        className="absolute w-full bg-black/50"
                        style={{
                            left: `${overlay.x * 100}%`,
                            top: `${overlay.y * 100}%`,
                            transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
                        }}
                    >
                        <Text className="text-white text-xl text-center px-4 py-2">
                            {overlay.content}
                        </Text>
                    </View>
                )
            ))}
        </>
    );
} 