import { createTemplateValidator, updateTemplateValidator } from "../utils/validators";
import { HttpCode, Request, Response } from "../core/constants";
import { Logger } from "../utils/helper";
import { Promise as Bluebird } from "bluebird"
import isValidUUID from "../utils/helper/validateUUID";
import RecipientModel from "../models/recipient";
import TemplateModel from "../models/template";
import { Recipient } from "../entity/Recipient";

const logger = new Logger('TemplateController');
const templateModel = new TemplateModel();
const recipientModel = new RecipientModel();

export default class TemplateController {
    public async createTemplate(req: Request, res: Response) {
        try {
            const { error, value } = await createTemplateValidator(req.body);

            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }

            const template = await templateModel.createTemplate(value);

            if(!template) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Template not created" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Template created successfully", template });
        } catch (error) {
            logger.error("Error during template creation:", error);
            throw error;
        }
    }

    public async getAllTemplates(req: Request, res: Response) {
        try {

            const templates = await templateModel.getAllTemplates();

            res.status(HttpCode.OK).send({ message: "Templates fetched successfully", templates });
        } catch (error) {
            logger.error("Error during template creation:", error);
            throw error;
        }
    }

    public async getTemplateById(req: Request, res: Response) {
        try {
            const template_id = req.params.id;

            if(isValidUUID(template_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid Template ID" });
                return;
            }

            if(!template_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Template ID is required" });
                return;
            }

            const template = await templateModel.getTemplateById(template_id);

            if (!template) {
                res.status(HttpCode.NOT_FOUND).send({ message: "Template not found" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Template fetched successfully", template });
        } catch (error) {
            logger.error("Error during template creation:", error);
            throw error;
        }
    }

    public async updateTemplate(req: Request, res: Response) {
        try {
            const template_id = req.params.id;

            if(isValidUUID(template_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid Template ID" });
                return;
            }

            if(!template_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Template ID is required" });
                return;
            }

            const template = await templateModel.getTemplateById(template_id);

            if (!template) {
                res.status(HttpCode.NOT_FOUND).send({ message: "Template not found" });
                return;
            }

            const { error, value } = await updateTemplateValidator(req.body)!;

            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }

            const { recipients = [] } = value!

            let recipients_details: Array<Recipient | null> = [];

            if(!!recipients.length) {
                recipients_details = await  Bluebird.mapSeries(recipients, async (recipient_id) => {
                    return await recipientModel.getRecipientById(recipient_id);
                }).filter(Boolean);
            }

            const updated_template = await templateModel.updateTemplate(template_id, { ...value, recipients: recipients_details });

            if(!updated_template) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Template not updated" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Template updated successfully", updated_template });
        } catch (error) {
            logger.error("Error during template creation:", error);
            throw error;
        }
    }
}