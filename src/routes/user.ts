import { Router } from "express";
import { user_role } from "../core/constants/enum";
import { UserController } from "../controller";
import authMiddleware from "../middleware/jwt";
import checkRole from "../middleware/checkrole";

const userRouter = Router();
const userController = new UserController();

userRouter.post('/user', authMiddleware, checkRole([user_role.admin]), userController.createUser);

userRouter.get('/users', authMiddleware, checkRole([user_role.admin]) ,userController.getAllUsers);
userRouter.get('/user/:id', authMiddleware, userController.getUserById);

userRouter.put('/user/:id', authMiddleware, checkRole([user_role.admin]) , userController.updateUser);
userRouter.put('/user/:id/activate', authMiddleware, checkRole([user_role.admin]) , userController.activateUser);
userRouter.put('/user/:id/deactivate', authMiddleware, checkRole([user_role.admin]) , userController.deactivateUser);
userRouter.put('/user/:id/suspend', authMiddleware, checkRole([user_role.admin]) , userController.suspendUser);

userRouter.delete('/user/:id', authMiddleware, checkRole([user_role.admin]) , userController.deleteUser);

export default userRouter;