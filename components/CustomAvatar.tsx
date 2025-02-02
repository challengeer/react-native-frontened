import UserAvatar from "react-native-user-avatar"; //No idea wgy is there an error, it seems to work fine


export default function CustomAvatar() {
    return (
        <UserAvatar
            size={40}
            name="John Doe" //Used for initials
        />
    );
}