import { createSubmissionValidator } from "../utils/validators";
import { HttpCode, Request, Response } from "../core/constants";
import { Logger } from "../utils/helper";
import isValidUUID from "../utils/helper/validateUUID";
import SubmissionModel from "../models/submission";
import FormModel from '../models/form'
import { Promise as Bluebird } from 'bluebird'

const logger = new Logger('SubmissionModel');
const submissionModel = new SubmissionModel();
const formModel = new FormModel();

export default class SubmissionController {
    public async createSubmission(req: Request, res: Response) {
        try {
            const { error, value } = await createSubmissionValidator(req.body);
    
            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }
    
            const submission = await submissionModel.createSubmission(value);
    
            if(!submission) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Submission not created" });
                return;
            }

            // send email and send sms to recipients
            const form = await formModel.getFormById(submission.form?.id);

            const { templates = [], form_fields } = form ?? {};
            const { submission_data } = submission
            
            console.log("🚀 ~ SubmissionController ~ createSubmission ~ form_fields:", JSON.parse(form_fields!))
            console.log("🚀 ~ SubmissionController ~ createSubmission ~ submission_data:", JSON.parse(submission_data))

            await Bluebird.mapSeries(templates, async (template) => {
                const { recipients, type } = template ?? {};
                if(type === 'email') {
                    console.log("🚀 ~ SubmissionController ~ createSubmission ~ type:", type)
                    console.log("🚀 ~ SubmissionController ~ createSubmission ~ recipients:", recipients)
                }
                
                if(type === 'sms') {
                    console.log("🚀 ~ SubmissionController ~ createSubmission ~ type:", type)
                    console.log("🚀 ~ SubmissionController ~ createSubmission ~ recipients:", recipients)
                }
            })
    
            res.status(HttpCode.OK).send({ message: "Submission created successfully", submission });
        } catch (error) {
            logger.error("Error during submission creation:", error);
            throw error;
        }
    }
    
    public async getAllSubmissions(req: Request, res: Response) {
        try {
            const submissions = await submissionModel.getAllSubmissions();
            res.status(HttpCode.OK).send({ message: "Submissions fetched successfully", submissions });
        } catch (error) {
            logger.error("Error during fetching submissions:", error);
            throw error;
        }
    }
}