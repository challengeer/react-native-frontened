export default interface UserInterface {
    user_id: string;
    display_name: string;
    username: string;
    profile_picture?: string;
}

export interface UserPrivateInterface extends UserInterface {
    email?: string;
    phone_number?: string;
}