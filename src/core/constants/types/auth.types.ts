import { User } from "../../../entity/User";
import { user_role } from "../enum";

export type TUserToken = {
    id: string;
    username: string;
    user_role: user_role;
}

export type CreateAuthParams = {
    user: User,
    access_token: string,
    refresh_token: string,
    id_token: string
};

export type UpdateAuthParams = {
    user: User,
    access_token?: string,
    refresh_token?: string,
    id_token?: string
};