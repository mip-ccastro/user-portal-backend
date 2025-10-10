import { createRecipientValidator, updateRecipientValidator } from "../utils/validators";
import { HttpCode, Request, Response } from "../core/constants";
import { Logger } from "../utils/helper";
import isValidUUID from "../utils/helper/validateUUID";
import RecipientModel from "../models/recipient";

const logger = new Logger('RecipientController');
const recipientModel = new RecipientModel();

export default class RecipientController {
    public async createRecipient(req: Request, res: Response) {
        try {
            const { error, value } = await createRecipientValidator(req.body);

            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }

            const recipient = await recipientModel.createRecipient(value);

            if(!recipient) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Recipient not created" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Recipient created successfully", recipient });
        } catch (error) {
            logger.error("Error during recipient creation:", error);
            throw error;
        }
    }

    public async getAllRecipients(req: Request, res: Response) {
        try {

            const recipients = await recipientModel.getAllRecipients();

            res.status(HttpCode.OK).send({ message: "Recipients fetched successfully", recipients });
        } catch (error) {
            logger.error("Error during fetching recipients:", error);
            throw error;
        }
    }

    public async getRecipientById(req: Request, res: Response) {
        try {
            const recipient_id = req.params.id;

            if(isValidUUID(recipient_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid Recipient ID" });
                return;
            }

            if(!recipient_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Recipient ID is required" });
                return;
            }

            const recipient = await recipientModel.getRecipientById(recipient_id);

            if (!recipient) {
                res.status(HttpCode.NOT_FOUND).send({ message: "Recipient not found" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Recipient fetched successfully", recipient });
        } catch (error) {
            logger.error("Error during fetching recipient:", error);
            throw error;
        }
    }

    public async updateRecipient(req: Request, res: Response) {
        try {
            const recipient_id = req.params.id;

            if(isValidUUID(recipient_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid Recipient ID" });
                return;
            }

            if(!recipient_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Recipient ID is required" });
                return;
            }

            const recipient = await recipientModel.getRecipientById(recipient_id);

            if (!recipient) {
                res.status(HttpCode.NOT_FOUND).send({ message: "Recipient not found" });
                return;
            }

            const { error, value } = await updateRecipientValidator(req.body);

            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }

            const updated_recipient = await recipientModel.updateRecipient(recipient_id, value);

            if(!updated_recipient) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Recipient not updated" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Recipient updated successfully", updated_recipient });
        } catch (error) {
            logger.error("Error during recipient update:", error);
            throw error;
        }
    }
}