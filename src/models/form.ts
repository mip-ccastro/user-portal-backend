import { Logger } from "../utils/helper";
import { Form } from "../entity/Form";
import dataSource from "../core/config/data-source";

const logger = new Logger('FormModel');
const formRepository = dataSource.getRepository(Form);

export default class FormModel {
    public async createForm(params: any) {
        try {
            const form = Form.create(params);
            await form.save();
            return form;
        } catch (error) {
            logger.error('Error creating form:', error);
            throw error;
        }
    }

    public async updateForm(id: string, params: any) {
        try {
            const form = await formRepository.createQueryBuilder('Form')
                .update(Form)
                .set({ ...params })
                .where('Form.id = :id', { id })
                .returning('*')
                .execute();
            return form.raw[0];
        } catch (error) {
            logger.error('Error updating form:', error);
            throw error;
        }
    }

    public async getAllForms() {
        try {
            const form = await formRepository.createQueryBuilder('Form')
                .leftJoinAndSelect('Form.templates', 'Templates')
                .orderBy('Form.updated_at', 'DESC')
                .select(['Form', 'Templates.id'])
                .getMany();

            return form;
        } catch (error) {
            logger.error('Error getting forms:', error);
            throw error;
        }
    }

    public async getFormById(id: string): Promise<Form | null> {
        try {
            const form = await formRepository.createQueryBuilder('Form')
                .leftJoinAndSelect('Form.templates', 'Templates')
                .leftJoinAndSelect('Templates.recipients', 'Recipients')
                .where('Form.id = :id', { id })
                .getOne();

            return form;
        } catch (error) {
            logger.error('Error getting form:', error);
            throw error;
        }
    }
}