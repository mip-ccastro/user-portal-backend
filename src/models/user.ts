import { User } from "../entity/User";
import dataSource from "../core/config/data-source";
import { Logger } from "../utils/helper";
import { CreateUserParams } from "../core/constants/types/user.types";
import { User_Credentials } from "../entity/User_Credential";

const logger = new Logger('UsersModel');
const userRepository = dataSource.getRepository(User);
const userCredentialRepository = dataSource.getRepository(User_Credentials);

export default class UserModel {

    public async createUser(createUserParams: CreateUserParams): Promise<User> {
        const { userData, userCredential } = createUserParams
        
        try {
            return await dataSource.transaction(
                async (transactionalEntityManager) => {
                    const user = userRepository.create(userData);
                    
                    const new_user = await transactionalEntityManager.save(
                        User,
                        user
                    );

                    const user_credential = userCredentialRepository.create(userCredential);
                    user_credential.user = new_user;

                    await transactionalEntityManager.save(
                        User_Credentials,
                        user_credential
                    );

                    return new_user
                }
            )
        } catch (error) {
            logger.error("Error creating user:", error);
            throw error;
        }
    }

    public async updateUser(user_id: string, params: any): Promise<User | null> {
        try {
            return dataSource.transaction(async (transactionalEntityManager) => {
                const { raw } = await transactionalEntityManager.createQueryBuilder()
                        .update(User)
                        .set({ ...params })
                        .where('user_id = :user_id', { user_id })
                        .returning('*')
                        .execute();

                if (!raw[0]) {
                    return null;
                }
                
                return raw[0];
            })
        } catch (error) {
            logger.error('Error updating user:', error as any);
            throw error
        }
    }

    public async deleteUser(user_id: string): Promise<User | null> {
        try {
            return dataSource.transaction(async (transactionalEntityManager) => {
                const { raw } = await transactionalEntityManager.createQueryBuilder()
                        .update(User)
                        .set({ user_status: -1, is_authorized: false })
                        .where('user_id = :user_id', { user_id })
                        .returning('*')
                        .execute();

                if (!raw[0]) {
                    return null;
                }
                
                return raw[0];
            })
        } catch (error) {
            logger.error('Error updating user:', error as any);
            throw error
        }
    }

    public async getAllUsers(): Promise<User[]> {
        try {
            const users = await userRepository.createQueryBuilder('User')
                .leftJoinAndSelect('User.user_credentials', 'User_Credentials')
                .andWhere('User.user_status != :status', { status: -1 })
                .select(['User', 'User_Credentials.username'])
                .orderBy('User.updated_at', 'DESC')
                .getMany();

            return users;
        } catch (error) {
            logger.error("Error fetching users:", error);
            throw error;
        }
    }

    public async getUserById(user_id: string): Promise<User | null> {
        try {
            const user = await userRepository.createQueryBuilder('User')
                .leftJoinAndSelect('User.user_credentials', 'User_Credentials')
                .where('User.user_id = :user_id', { user_id })
                .select(['User', 'User_Credentials.username'])
                .getOne();

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            logger.error("Error fetching user by ID:", error);
            throw error;
        }
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await userRepository.createQueryBuilder('User')
                .where('User.email = :email', { email })
                .getOne();

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    public async getUserByUsername(username: string): Promise<User | null> {
        try {
            const user = await userRepository.createQueryBuilder('User')
                .leftJoinAndSelect('User.user_credentials', 'User_Credentials')
                .where('User_Credentials.username = :username', { username })
                .getOne();

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    public async getUserByField(field: string, value: string): Promise<User | null> {
        try {

            const user_fields: string[] = userRepository.metadata.columns.map(col => col.propertyName);

            if (!user_fields.includes(field)) {
                throw new Error(`Invalid field: ${field}. Valid fields are: ${user_fields.join(", ")}`);
            }

            if(!value) {
                throw new Error(`Value for field ${field} cannot be empty.`);
            }

            const user = await User.findOne({
                where: { [field]: value },
                relations: ["password"]
            });

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            throw error;
        }
    }
    
    public async activateUser(user_id: string): Promise<User | null> {
        try {
            return dataSource.transaction(async (transactionalEntityManager) => {
                const { raw } = await transactionalEntityManager.createQueryBuilder()
                        .update(User)
                        .set({ user_status: 1, is_authorized: true })
                        .where('user_id = :user_id', { user_id })
                        .returning('*')
                        .execute();

                if (!raw[0]) {
                    return null;
                }
                
                return raw[0];
            })
        } catch (error) {
            logger.error('Error updating user:', error as any);
            throw error
        }
    }

    public async deactivateUser(user_id: string): Promise<User | null> {
        try {
            return dataSource.transaction(async (transactionalEntityManager) => {
                const { raw } = await transactionalEntityManager.createQueryBuilder()
                        .update(User)
                        .set({ user_status: 0, is_authorized: false })
                        .where('user_id = :user_id', { user_id })
                        .returning('*')
                        .execute();

                if (!raw[0]) {
                    return null;
                }
                
                return raw[0];
            })
        } catch (error) {
            logger.error('Error updating user:', error as any);
            throw error
        }
    }

    public async suspendUser(user_id: string): Promise<User | null> {
        try {
            return dataSource.transaction(async (transactionalEntityManager) => {
                const { raw } = await transactionalEntityManager.createQueryBuilder()
                        .update(User)
                        .set({ user_status: 2, is_authorized: false })
                        .where('user_id = :user_id', { user_id })
                        .returning('*')
                        .execute();

                if (!raw[0]) {
                    return null;
                }
                
                return raw[0];
            })
        } catch (error) {
            logger.error('Error updating user:', error as any);
            throw error
        }
    }
}