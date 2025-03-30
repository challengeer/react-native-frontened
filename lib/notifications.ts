import { router } from 'expo-router';
import { getMessaging, getToken, onMessage, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import { QueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { PermissionsAndroid, Platform } from 'react-native';

const requestUserPermission = async () => {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } else {
        const messaging = getMessaging();
        await messaging.requestPermission();
    }
};

export async function getFCMToken() {
    try {
        const messaging = getMessaging();
        const fcmToken = await getToken(messaging);
        return fcmToken;
    } catch (error) {
        console.log('Error getting FCM token:', error);
        return null;
    }
}

export function setupNotificationHandlers(queryClient: QueryClient) {
    requestUserPermission();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const messaging = getMessaging();

    const messageUnsubscribe = onMessage(messaging, async (remoteMessage) => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: remoteMessage.notification?.title,
                body: remoteMessage.notification?.body,
            },
            trigger: null,
        });

        const data = remoteMessage.data;
        switch (data?.type) {
            case 'challenge_invite':
                queryClient.invalidateQueries({ queryKey: ['challenges'] });
                queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge_id] });
                break;

            case 'challenge_accept':
                queryClient.invalidateQueries({ queryKey: ['challenges'] });
                queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge_id] });
                break;

            case 'challenge_submission':
                queryClient.invalidateQueries({ queryKey: ['challenges'] });
                queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge_id] });
                queryClient.invalidateQueries({ queryKey: ['submissions', data.challenge_id] });
                break;

            case 'challenge_ending':
                queryClient.invalidateQueries({ queryKey: ['challenges'] });
                queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge_id] });
                break;

            case 'friend_request':
                queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
                break;

            case 'friend_accept':
                queryClient.invalidateQueries({ queryKey: ['friends'] });
                queryClient.invalidateQueries({ queryKey: ['user', data.user_id] });
                break;
        }
    });

    const notificationOpenedUnsubscribe = onNotificationOpenedApp(messaging, (remoteMessage) => {
        const data = remoteMessage.data;
        switch (data?.type) {
            case 'challenge_invite':
                router.push(`/(app)/challenge/${data.challenge_id}`);
                break;

            case 'challenge_accept':
                router.push(`/(app)/challenge/${data.challenge_id}`);
                break;

            case 'challenge_submission':
                router.push(`/(app)/submission/${data.challenge_id}`);
                break;

            case 'challenge_ending':
                router.push(`/(app)/challenge/${data.challenge_id}`);
                break;

            case 'friend_request':
                router.push(`/(app)/user/${data.sender_id}`);
                break;

            case 'friend_accept':
                router.push(`/(app)/user/${data.user_id}`);
                break;
        }
    });

    return () => {
        messageUnsubscribe();
        notificationOpenedUnsubscribe();
    };
}