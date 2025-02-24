import { useCallback } from 'react';
import * as Picker from 'expo-image-picker';

interface ImagePickerProps {
    onImageSelect?: (uri: string) => void;
}

export default function useImagePicker({ onImageSelect }: ImagePickerProps) {
    const pickImage = useCallback(async () => {
        try {
            const result = await Picker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                onImageSelect?.(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    }, [onImageSelect]);

    return pickImage;
}

