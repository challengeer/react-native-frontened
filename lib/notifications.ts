import { router } from 'expo-router';
import { getMessaging, getToken, onMessage, AuthorizationStatus } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

const requestUserPermission = async () => {
    const messaging = getMessaging();
    const authStatus = await messaging.requestPermission();
    const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log("Authorization status:", authStatus);
    }

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

export function setupNotificationHandlers() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const messaging = getMessaging();
    
    onMessage(messaging, async (remoteMessage) => {
        console.log('Received foreground message:', remoteMessage);
        console.log('Notification data:', remoteMessage.data);
    });

    // Handle notification taps
    messaging.onNotificationOpenedApp((message) => {
        const data = message.notification?.data;

        switch (data.type) {
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