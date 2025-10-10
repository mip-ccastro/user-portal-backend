import { Router } from "express";
import { user_role } from "../core/constants/enum";
import { TemplateController } from "../controller";
import authMiddleware from "../middleware/jwt";
import checkRole from "../middleware/checkrole";

const templateRouter = Router();
const templateController = new TemplateController();

templateRouter.post('/template', authMiddleware, checkRole([user_role.admin]), templateController.createTemplate);

templateRouter.get('/templates', authMiddleware, checkRole([user_role.admin]), templateController.getAllTemplates);
templateRouter.get('/template/:id', authMiddleware, checkRole([user_role.admin]), templateController.getTemplateById);

templateRouter.put('/template/:id', authMiddleware, checkRole([user_role.admin]) , templateController.updateTemplate);

// templateRouter.delete('/template/:id', authMiddleware, checkRole([user_role.admin]) , templateController.deleteTemplate);

export default templateRouter;