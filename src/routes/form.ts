import { Router } from "express";
import { user_role } from "../core/constants/enum";
import { FormController } from "../controller";
import authMiddleware from "../middleware/jwt";
import checkRole from "../middleware/checkrole";

const formRouter = Router();
const formController = new FormController();

formRouter.post('/form', authMiddleware, checkRole([user_role.admin]), formController.createForm);

formRouter.get('/forms', authMiddleware, checkRole([user_role.admin, user_role.user]), formController.getAllForms);
formRouter.get('/form/:id', authMiddleware, checkRole([user_role.admin, user_role.user]), formController.getFormById);

formRouter.put('/form/:id', authMiddleware, checkRole([user_role.admin]) , formController.updateForm);

// formRouter.delete('/form/:id', authMiddleware, checkRole([user_role.admin]) , formController.deleteform);

export default formRouter;