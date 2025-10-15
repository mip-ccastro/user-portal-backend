import { createFormValidator, updateFormValidator } from "../utils/validators";
import { HttpCode, Request, Response } from "../core/constants";
import { Logger } from "../utils/helper";
import FormModel from "../models/form";
import isValidUUID from "../utils/helper/validateUUID";

const logger = new Logger('FormController');
const formModel = new FormModel();

export default class FormController {
    public async createForm(req: Request, res: Response) {
        try {
            const { error, value } = await createFormValidator(req.body);

            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }

            const form = await formModel.createForm(value);

            if(!form) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Form not created" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Form created successfully", form });
        } catch (error) {
            logger.error("Error during form creation:", error);
            throw error;
        }
    }

    public async getAllForms(req: Request, res: Response) {
        try {

            const forms = await formModel.getAllForms();

            res.status(HttpCode.OK).send({ message: "Forms fetched successfully", forms });
        } catch (error) {
            logger.error("Error during fetching forms:", error);
            throw error;
        }
    }

    public async getFormById(req: Request, res: Response) {
        try {
            const form_id = req.params.id;

            if(isValidUUID(form_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid Form ID" });
                return;
            }

            if(!form_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Form ID is required" });
                return;
            }

            const form = await formModel.getFormById(form_id);

            if (!form) {
                res.status(HttpCode.NOT_FOUND).send({ message: "Form not found" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Form fetched successfully", form });
        } catch (error) {
            logger.error("Error during fetching form:", error);
            throw error;
        }
    }

    public async updateForm(req: Request, res: Response) {
        try {
            const form_id = req.params.id;

            if(isValidUUID(form_id) === false) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Invalid Form ID" });
                return;
            }

            if(!form_id) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Form ID is required" });
                return;
            }

            const form = await formModel.getFormById(form_id);

            if (!form) {
                res.status(HttpCode.NOT_FOUND).send({ message: "Form not found" });
                return;
            }

            const { error, value } = await updateFormValidator(req.body);

            if(error) {
                res.status(HttpCode.BAD_REQUEST).send({ message: error });
                return;
            }

            const updated_form = await formModel.updateForm(form_id, value);

            if(!updated_form) {
                res.status(HttpCode.BAD_REQUEST).send({ message: "Form not updated" });
                return;
            }

            res.status(HttpCode.OK).send({ message: "Form updated successfully", updated_form });
        } catch (error) {
            logger.error("Error during form update:", error);
            throw error;
        }
    }
}