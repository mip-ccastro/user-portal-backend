import { createSubmissionValidator } from "../utils/validators";
import { envs } from "../core/config/env";
import { HttpCode, Request, Response } from "../core/constants";
import { Logger } from "../utils/helper";
import { mailSender } from "../app";
import { Promise as Bluebird } from 'bluebird'
import FormModel from '../models/form'
import isValidUUID from "../utils/helper/validateUUID";
import prepareHtml from "../utils/email/prepareHtmlBody";
import SubmissionModel from "../models/submission";

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
            const { submission_data } = submission ?? {};
            const data = JSON.parse(submission_data);

            await Bluebird.mapSeries(templates, async (template) => {
                const { recipients, type, content } = template ?? {};
                if(type === 'email') {
                    let template_content = content;
                    
                    Object.keys(data).forEach((key: string) => {
                        const value = data[key];
                        template_content = template_content.replace(new RegExp('{{' + key + '}}', 'gi'), value);
                    });

                    const prepared_html = await prepareHtml({ 
                        template: 'email_template', 
                        data: { 
                            CONTENT: template_content,
                            PREHEADER_TEXT: form?.form_name!,
                        }
                    });

                    await mailSender.sendEmail({
                        senderName: 'MIP Communicator',
                        body: prepared_html,
                        fromEmail: envs.AZURE_EMAIL_MAILBOX,
                        subject: form?.form_name!,
                        toEmail: recipients.map((e) => e.email),
                        attachments: []
                    });
                }
                
                if(type === 'sms') {
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