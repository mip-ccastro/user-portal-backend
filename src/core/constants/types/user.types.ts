import { user_role } from "../enum";

export type userData = {
    user_role: user_role;
    email: string;
    first_name?: string;
    last_name?: string;
    is_authorized?: boolean;
    user_status?: number;
}

export type userCredentialData = {
    username: string;
    password: string;
}

export type CreateUserParams = {
    userData: userData;
    userCredential: userCredentialData;
};