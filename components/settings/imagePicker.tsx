import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImagePickerProps {
    onImageSelect?: (formData: FormData) => void;
}

export default function useImagePicker({ onImageSelect }: ImagePickerProps) {
    const processImage = async (uri: string) => {
        try {
            // Resize image to 400x400
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 400, height: 400 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Create FormData for backend
            const formData = new FormData();
            formData.append('image', {
                uri: manipulatedImage.uri,
                type: 'image/jpeg',
                name: 'profile-image.jpg'
            } as any);

            return formData;
        } catch (error) {
            console.error('Error processing image:', error);
            throw error;
        }
    };

    const pickImage = useCallback(async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need media library permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                const formData = await processImage(result.assets[0].uri);
                onImageSelect?.(formData);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    }, [onImageSelect]);

    return pickImage;
}

