import { envs } from "../core/config/env";
import { HttpCode, X_ACCESS_TOKEN, X_ID_TOKEN, X_REFRESH_TOKEN } from "../core/constants";
import { JsonWebTokenError } from "jsonwebtoken";
import { Logger } from "../utils/helper";
import { Request, Response } from "express";
import { signInValidator } from "../utils/validators";
import { TUserToken } from "../core/constants/types/auth.types";
import AuthModel from "../models/auth";
import bcrypt from 'bcryptjs';
import JwtService from "../utils/auth/jwt";
import UserModel from "../models/user";

const authModel = new AuthModel();
const JwtServiceInstance = new JwtService();
const userModel = new UserModel();
const logger = new Logger('UserController');

export default class AuthController {

    public async signIn(req: Request, res: Response) {
        try {

            const { error, value } = await signInValidator(req.body);

			if (error) {
				res.status(HttpCode.BAD_REQUEST).send({ message: error });
				return;
			}

			const { username, password } = value!;

			const user = await userModel.getUserByUsername(username);

            if (!user) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'INVALID_USERNAME_PASSWORD' });
				return;
			}

            const isPasswordValid = await bcrypt.compare(password, user.user_credentials.password);

            if (!isPasswordValid) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'INVALID_USERNAME_PASSWORD' });
				return;
			}

            if(!user.is_authorized) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'USER_NOT_AUTHORIZED' });
				return;
			}

            if(user.user_status === -1) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'ACCOUNT_DELETED' });
				return;
			}

			if(user.user_status === 0) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'ACCOUNT_INACTIVE' });
				return;
			}

			if(user.user_status === 2) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'ACCOUNT_SUSPENDED' });
				return;
			}

            const token_payload: TUserToken = { 
				id: user.user_id, 
				username: user.user_credentials.username, 
				user_role: user.user_role 
			};

            const token = await JwtServiceInstance.sign({ 
				payload: token_payload,
				type: 'jwt_token'
			});
			const access_token = await JwtServiceInstance.sign({
				payload: token_payload,
				type: 'access_token',
				// @ts-ignore
				options: { expiresIn: envs.ACCESS_TOKEN_EXPIRY }
			});
			const refresh_token = await JwtServiceInstance.sign({
				payload: token_payload,
				type: 'refresh_token',
				//@ts-ignore
				options: { expiresIn: envs.REFRESH_TOKEN_EXPIRTY }
			});

            const auth = await authModel.getAuthByUserId({ user_id: user.user_id });

            if (!auth) {
				await authModel.createAuth({
					user: user,
					access_token,
					refresh_token,
					id_token: token
				});
			} else {
				await authModel.updateAuth({
					user: user,
					access_token,
					refresh_token,
					id_token: token
				});
			}

            res.header(X_ACCESS_TOKEN, access_token);
			res.header(X_REFRESH_TOKEN, refresh_token);
			res.header(X_ID_TOKEN, token);

            let logged_user = await userModel.getUserById(user.user_id);

            res.status(HttpCode.OK).send({ message: 'SIGNIN_SUCCESS', user: logged_user });
        } catch (error) {
            logger.error("Error during sign-in:", error);
            throw error;
        }
    }

    public async signOut(req: Request, res: Response) {

		const id_token = req.headers[X_ID_TOKEN] as string ?? null;
		
		try {
			if (!id_token) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: "Unauthorized" });
				return;
			}

			const { id } = await JwtServiceInstance.verify(id_token, 'jwt_token');

			const auth = await authModel.getAuthByIdToken(id_token);

			if (!auth) {
				res.status(HttpCode.BAD_REQUEST).send({ message: "Session not found" });
				return;
			}

			await authModel.removeAuth(id);

			res.status(HttpCode.OK).send({ message: "Sign-out successful" });
		} catch (error) {
			logger.error('Error during sign-out:', error);

			if(error instanceof JsonWebTokenError) {
				if(error.message === 'jwt expired'){
					const auth = await authModel.getAuthByIdToken(id_token);
					if (auth) {
						await authModel.removeAuth(auth.user.user_id);
					}
					res.status(HttpCode.OK).send({ message: "Sign-out successful" });					
					return;
				} else if(error.message === 'invalid token' || error.message === 'jwt malformed' || error.message === 'invalid signature') {
					res.status(HttpCode.UNAUTHORIZED).send({ message: "Unauthorized" });
					return;
				}
			}

			throw error;
		}
	}

    public async newAccessToken(req: Request, res: Response) {
		try {
			const refresh_token = req.headers[X_REFRESH_TOKEN] as string;

			if (!refresh_token) {
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'UNAUTHORIZED' });
				return;
			}

			const result = await JwtServiceInstance.verify(refresh_token, 'refresh_token').then(async (decoded: any) => {
				return {
					success: true,
					decoded,
					message: 'Token is valid'
				}
			}).catch((err) => {
				return {
					success: false,
					decoded: null,
					message: err?.message || 'Something went wrong!' 
				}
			})
			
			//@ts-ignore
			const { success, decoded, message } = result ?? {}
			const auth = await authModel.getAuthByRefreshToken(refresh_token);

			if(!success || !auth) {
				if(!success) {
					logger.error('Error in verifying refresh token:', message);
				}
				if(auth) {
					logger.info('Signing out user...')
					await authModel.removeAuth(auth.user.user_id)
					logger.info('User signed out successfully.')
				}
				res.status(HttpCode.UNAUTHORIZED).send({ message: 'UNAUTHORIZED' });
				return;
			}

			
			const { id, username, user_profile } = decoded;

			const access_token = await JwtServiceInstance.sign({
					payload : { id, username, user_profile },
					type: 'access_token',
					// @ts-ignore
					options: { expiresIn: envs.ACCESS_TOKEN_EXPIRY }
			});

			const user = await userModel.getUserById(id);

			if(!user) {
				res.status(HttpCode.BAD_REQUEST).send({ message: 'USER_NOT_FOUND' });
				return;
			}

			await authModel.updateAuth({
				user: user,
				access_token
			});

			res.header(X_ACCESS_TOKEN, access_token);
			res.status(HttpCode.OK).send({ message: 'ACCESS_TOKEN_UPDATE', access_token });
		} catch (error) {
			logger.error('Error getting new access token:', error);
			throw error;
		}
	}
}