import { AuthController } from "../controller";
import { Router } from "express";

const authRouter = Router();
const authController = new AuthController();

authRouter.get('/refresh-access-token', authController.newAccessToken);

authRouter.post('/signin', authController.signIn);

authRouter.delete('/signout', authController.signOut);

export default authRouter;