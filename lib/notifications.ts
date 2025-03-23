import { router } from 'expo-router';
import { getMessaging, getToken, onMessage, onNotificationOpenedApp, AuthorizationStatus } from '@react-native-firebase/messaging';
import { QueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

const requestUserPermission = async () => {
    const messaging = getMessaging();
    const authStatus = await messaging.requestPermission();
    const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

    return enabled;
};

export async function getFCMToken() {
    try {
        await requestUserPermission();
        const messaging = getMessaging();
        const fcmToken = await getToken(messaging);
        return fcmToken;
    } catch (error) {
        console.log('Error getting FCM token:', error);
        return null;
    }
}

export function setupNotificationHandlers(queryClient: QueryClient) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const messaging = getMessaging();

    onMessage(messaging, async (remoteMessage) => {
        // Handle query invalidation based on notification type
        const data = remoteMessage.data;
        switch (data?.type) {
            case 'challenge_invite':
                queryClient.invalidateQueries({ queryKey: ['challenges'] });
                queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge_id] });
                break;

            case 'challenge_submission':
                queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge_id] });
                queryClient.invalidateQueries({ queryKey: ['submissions', data.challenge_id] });
                break;

            case 'challenge_ending':
                queryClient.invalidateQueries({ queryKey: ['challenges'] });
                queryClient.invalidateQueries({ queryKey: ['challenge', data.challenge_id] });
                break;

            case 'friend_request':
                try {
                    queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
                } catch (error) {
                    console.log('Error invalidating friend requests:', error);
                }
                break;

            case 'friend_accept':
                queryClient.invalidateQueries({ queryKey: ['friends'] });
                queryClient.invalidateQueries({ queryKey: ['user', data.user_id] });
                break;
        }
    });

    // Handle initial notification (app opened from killed state)
    onNotificationOpenedApp(messaging, (remoteMessage) => {
        // Handle navigation
        const data = remoteMessage.data;
        switch (data?.type) {
            case 'challenge_invite':
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
}