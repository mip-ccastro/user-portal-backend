import { createUserValidator, updateUserValidator } from "../utils/validators";
import { HttpCode, Request, Response } from "../core/constants";
import { Logger } from "../utils/helper";
import { user_role } from "../core/constants/enum";
import bcrypt from 'bcryptjs';
import isValidUUID from "../utils/helper/validateUUID";
import JwtService from "../utils/auth/jwt";
import UserModel from "../models/user";

const userModel = new UserModel();
const JwtServiceInstance = new JwtService();
const logger = new Logger('UserController');

export default class UserController {
    public async createUser(req: Request, res: Response) {
        try {
            const { value, error } = await createUserValidator(req.body)

            if (error) {
				res.status(HttpCode.BAD_REQUEST).send({ message: error });
				return;
			}

            const {
                username,
                email,
                password,
                user_role,
                first_name,
                is_authorized,
                last_name,
                user_status,
            } = value!;

            const is_username_exist = await userModel.getUserByUsername(username);

            if (is_username_exist) {
				res.status(HttpCode.BAD_REQUEST).send({ message: "Username already exist" });
				return;
			}

            const is_email_exist = await userModel.getUserByEmail(email);

            if (is_email_exist) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Email already exist" });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userModel.createUser({
				userCredential: {
					username,
					password: hashedPassword,
				},
				userData: {
                    user_role: user_role as user_role,
                    first_name,
                    is_authorized,
                    last_name,
                    user_status,
                    email
				},
			});

            if (!newUser) {
				res.status(HttpCode.INTERNAL_SERVER_ERROR).send({ message: "Error creating user" });
				return;
			}

            res.status(HttpCode.CREATED).send({ message: "User created successfully", user: newUser });
        } catch (error) {
            logger.error("Error during user creation:", error);
            throw error;
        }
    }

    public async updateUser(req: Request, res: Response) {
        try {
            const user_id = req.params.id;

            if(isValidUUID(user_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid User ID" });
                return;
            }

            if(!user_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "User ID is required" });
                return;
            }

            const { value, error } = await updateUserValidator(req.body);
            const { username } = req.user ?? {};

            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }

            const user = await userModel.getUserById(user_id);

            if (!user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User not found" });
                return;
            }

            const updated_user = await userModel.updateUser(user_id, {
                ...value,
                updated_by: username || 'system',
            });

            if(!updated_user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User failed to update" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "User updated successfully", user: updated_user });

        } catch (error) {
            logger.error("Error during user update:", error);
            throw error;
        }
    }

    public async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userModel.getAllUsers();

            res.status(HttpCode.OK).send({ message: "Users fetched successfully", users });
        } catch (error) {
            logger.error("Error during user creation:", error);
            throw error;
        }
    }

    public async getUserById(req: Request, res: Response) {
        try {
            const user_id = req.params.id;

            if(isValidUUID(user_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid User ID" });
                return;
            }

            if(!user_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "User ID is required" });
                return;
            }

            const user = await userModel.getUserById(user_id);

            if (!user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User not found" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "User fetched successfully", user });
        } catch (error) {
            logger.error("Error during user creation:", error);
            throw error;
        }   
    }

    public async deleteUser(req: Request, res: Response) {
        try {
            const user_id = req.params.id;

            if(isValidUUID(user_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid User ID" });
                return;
            }

            if(!user_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "User ID is required" });
                return;
            }

            const user = await userModel.getUserById(user_id);

            if (!user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User not found" });
                return;
            }

            const deleted_user = await userModel.deleteUser(user_id);

            if(!deleted_user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User failed to delete" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "User deleted successfully" });
        } catch (error) {
            logger.error("Error during user creation:", error);
            throw error;
        } 
    }

    public async activateUser(req: Request, res: Response) {
        try {
            const user_id = req.params.id;

            if(isValidUUID(user_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid User ID" });
                return;
            }

            if(!user_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "User ID is required" });
                return;
            }

            const user = await userModel.getUserById(user_id);

            if (!user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User not found" });
                return;
            }

            const deleted_user = await userModel.activateUser(user_id);

            if(!deleted_user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User failed to activate" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "User activated successfully" });
        } catch (error) {
            logger.error("Error during user activation:", error);
            throw error;
        } 
    }

    public async deactivateUser(req: Request, res: Response) {
        try {
            const user_id = req.params.id;

            if(isValidUUID(user_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid User ID" });
                return;
            }

            if(!user_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "User ID is required" });
                return;
            }

            const user = await userModel.getUserById(user_id);

            if (!user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User not found" });
                return;
            }

            const deleted_user = await userModel.deactivateUser(user_id);

            if(!deleted_user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User failed to deactivate" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "User deactivated successfully" });
        } catch (error) {
            logger.error("Error during user deactivation:", error);
            throw error;
        } 
    }

    public async suspendUser(req: Request, res: Response) {
        try {
            const user_id = req.params.id;

            if(isValidUUID(user_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid User ID" });
                return;
            }

            if(!user_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "User ID is required" });
                return;
            }

            const user = await userModel.getUserById(user_id);

            if (!user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User not found" });
                return;
            }

            const deleted_user = await userModel.suspendUser(user_id);

            if(!deleted_user) {
                res.status(HttpCode.NOT_FOUND).send({ message: "User failed to suspend" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "User suspended successfully" });
        } catch (error) {
            logger.error("Error during user suspension:", error);
            throw error;
        } 
    }
}