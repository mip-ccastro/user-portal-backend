import { Router } from "express";
import { SubmissionController } from "../controller";
import { user_role } from "../core/constants/enum";
import authMiddleware from "../middleware/jwt";
import checkRole from "../middleware/checkrole";

const submissionRouter = Router();
const submissionController = new SubmissionController();

submissionRouter.post('/submit', authMiddleware, submissionController.createSubmission);

submissionRouter.get('/submissions', authMiddleware, checkRole([user_role.admin]), submissionController.getAllSubmissions);

export default submissionRouter;