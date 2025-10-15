import { Logger } from "../utils/helper";
import { Template } from "../entity/Template";
import dataSource from "../core/config/data-source";
import { Recipient } from "../entity/Recipient";
import { Form } from "../entity/Form";

const logger = new Logger('TemplateModel');
const templateRepository = dataSource.getRepository(Template);

export default class TemplateModel {
    public async createTemplate(params: any) {
        try {
            const template = Template.create(params);
            await template.save();
            return template;
        } catch (error) {
            logger.error('Error creating template:', error);
            throw error;
        }
    }

    public async updateTemplate(id: string, params: any) {
        try {

            return dataSource.transaction(async (transactionalEntityManager) => {
                
                const { recipients = [], form_id, ...rest } = params ?? {}

                const { raw } = await transactionalEntityManager.createQueryBuilder()
                    .update(Template)
                    .set({ ...rest })
                    .where('Template.id = :id', { id })
                    .returning('*')
                    .execute();

                const template = await transactionalEntityManager.getRepository(Template)
                        .createQueryBuilder()
                        .leftJoinAndSelect('Template.recipients', 'recipients')
                        .leftJoinAndSelect('Template.form', 'form')
                        .where('Template.id = :id', { id })
                        .getOne();

                if(!!recipients.length) {

                    const recipient_ids = recipients.map((recipient: Recipient) => recipient.id);

                    await transactionalEntityManager.createQueryBuilder()
                        .relation(Template, 'recipients')
                        .of(raw[0].id)
                        .addAndRemove(recipient_ids, template?.recipients);
                } else {

                    await transactionalEntityManager.createQueryBuilder()
                        .relation(Template, 'recipients')
                        .of(raw[0].id)
                        .remove(template?.recipients);
                        
                }

                if(form_id !== '') {
                    const _form = await transactionalEntityManager.getRepository(Form)
                        .createQueryBuilder()
                        .andWhere('Form.id = :id', { id: form_id })
                        .getOne();

                    await transactionalEntityManager.createQueryBuilder()
                        .relation(Template, 'form')
                        .of(raw[0].id)
                        .set(_form);
                } else {
                    if(template && template.form) {
                        await transactionalEntityManager.createQueryBuilder()
                            .relation(Template, 'form')
                            .of(raw[0].id)
                            .remove(template.form);
                    }
                }
                

                return raw[0];
            })
        } catch (error) {
            logger.error('Error updating template:', error);
            throw error;
        }
    }

    public async getAllTemplates() {
        try {
            const templates = await templateRepository.createQueryBuilder('Template')
                .leftJoinAndSelect('Template.recipients', 'Recipients')
                .orderBy('Template.updated_at', 'DESC')
                .getMany();

            return templates;
        } catch (error) {
            logger.error('Error getting templates:', error);
            throw error;
        }
    }

    public async getTemplateById(id: string): Promise<Template | null> {
        try {
            const template = await templateRepository.createQueryBuilder('Template')
                .leftJoinAndSelect('Template.recipients', 'recipients')
                .leftJoinAndSelect('Template.form', 'form')
                .where('Template.id = :id', { id })
                .select(['Template', 'recipients.id', 'form.id'])
                .getOne();

            return template;
        } catch (error) {
            logger.error('Error getting template:', error);
            throw error;
        }
    }
}