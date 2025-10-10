import { Router } from "express";
import { user_role } from "../core/constants/enum";
import { RecipientController } from "../controller";
import authMiddleware from "../middleware/jwt";
import checkRole from "../middleware/checkrole";

const recipientRouter = Router();
const recipientController = new RecipientController();

recipientRouter.post('/recipient', authMiddleware, checkRole([user_role.admin]), recipientController.createRecipient);

recipientRouter.get('/recipients', authMiddleware, checkRole([user_role.admin]), recipientController.getAllRecipients);
recipientRouter.get('/recipient/:id', authMiddleware, checkRole([user_role.admin]), recipientController.getRecipientById);

recipientRouter.put('/recipient/:id', authMiddleware, checkRole([user_role.admin]) , recipientController.updateRecipient);

// recipientRouter.delete('/recipient/:id', authMiddleware, checkRole([user_role.admin]) , recipientController.deleteRecipient);

export default recipientRouter;