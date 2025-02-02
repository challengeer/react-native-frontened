import UserAvatar from "react-native-user-avatar"; //No idea wgy is there an error, it seems to work fine

interface CustomAvatarProps {
    name: string; // Used for initials, maybe change it later but I think it's good for default setting
    large?: boolean; 
    src?: string; // Used for image/backround
}

export default function CustomAvatar({ name = "", large = false, src = "" }: CustomAvatarProps) {
    return (
        <UserAvatar
            size={large ? 60 : 40}
            name={name} 
            src={src}
        />
    );
}