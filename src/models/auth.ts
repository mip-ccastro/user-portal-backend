import { Auth } from "../entity/Auth";
import { CreateAuthParams, UpdateAuthParams } from "../core/constants/types/auth.types";
import { Logger } from "../utils/helper";
import dataSource from "../core/config/data-source";

const logger = new Logger('AuthModel');
const authRepository = dataSource.getRepository(Auth);

export default class AuthModel {
    public async createAuth(params: CreateAuthParams): Promise<Auth> {
        try {
            const auth = Auth.create({
                user: params.user,
                access_token: params.access_token,
                refresh_token: params.refresh_token,
                id_token: params.id_token
            });
            await auth.save();
            return auth;
        } catch (error) {
            logger.error('Error creating auth:', error);
            throw error;
        }
    }

     public async updateAuth(params: UpdateAuthParams): Promise<Auth | null> {
        try {

            const updated_auth = {
                access_token: params.access_token || '',
                refresh_token: params.refresh_token || '',
                id_token: params.id_token || ''
            }

            for (const key in updated_auth) {
                //@ts-ignore
                if (!updated_auth[key]) {
                    //@ts-ignore
                    delete updated_auth[key];
                }
            }

            const auth = await authRepository.createQueryBuilder('Auth')
                .update(Auth)
                .set(updated_auth)
                .where('user_id = :user_id', { user_id: params.user.user_id })
                .returning('*')
                .execute();
            return auth.raw[0];
        } catch (error) {
            logger.error('Error updating auth:', error);
            throw error;
        }
    }

    public async removeAuth(user_id: string): Promise<boolean> {
        try {
            await authRepository.createQueryBuilder('Auth')
                .delete()
                .where('user_id = :user_id', { user_id: user_id })
                .execute();
            return true;
        } catch (error) {
            logger.error('Error removing auth:', error);
            throw error;
        }
    }

    public async getAuthByUserId(params: { user_id: string }): Promise<Auth | null> {
        try {
            const auth = await authRepository.createQueryBuilder('Auth')
                .leftJoinAndSelect('Auth.user', 'User')
                .where('User.user_id = :user_id', { user_id: params.user_id })
                .getOne();

            if (!auth) {
               return null
            }

            return auth;
        } catch (error) {
            logger.error('Error getting auth:', error);
            throw error;
        }
    }

    public async getAuthByAccessToken(access_token: string): Promise<Auth | null> {
        try {
            const auth = await authRepository.createQueryBuilder('Auth')
                .leftJoinAndSelect('Auth.user', 'User')
                .leftJoinAndSelect('User.user_credentials', 'User_Credentials')
                .where('Auth.access_token = :access_token', { access_token })
                .getOne();

            if (!auth) {
               return null
            }

            return auth;
        } catch (error) {
            logger.error('Error getting auth:', error);
            throw error;
        }
    }

    public async getAuthByIdToken(id_token: string): Promise<Auth | null> {
        try {
            const auth = await authRepository.createQueryBuilder('Auth')
                .leftJoinAndSelect('Auth.user', 'User')
                .where('Auth.id_token = :id_token', { id_token })
                .getOne();

            if (!auth) {
               return null
            }

            return auth;
        } catch (error) {
            logger.error('Error getting auth:', error);
            throw error;
        }
    }

    public async getAuthByRefreshToken(refresh_token: string): Promise<Auth | null> {
        try {
            const auth = await authRepository.createQueryBuilder('Auth')
                .leftJoinAndSelect('Auth.user', 'User')
                .where('Auth.refresh_token = :refresh_token', { refresh_token })
                .getOne();

            if (!auth) {
               return null
            }

            return auth;
        } catch (error) {
            logger.error('Error getting auth:', error);
            throw error;
        }
    }
}