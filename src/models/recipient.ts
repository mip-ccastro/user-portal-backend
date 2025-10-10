import { Logger } from "../utils/helper";
import { Recipient } from "../entity/Recipient";
import dataSource from "../core/config/data-source";

const logger = new Logger('RecipientModel');
const recipientRepository = dataSource.getRepository(Recipient);

export default class RecipientModel {
    public async createRecipient(params: any) {
        try {
            const recipient = Recipient.create(params);
            await recipient.save();
            return recipient;
        } catch (error) {
            logger.error('Error creating recipient:', error);
            throw error;
        }
    }

    public async updateRecipient(id: string, params: any) {
        try {
            const recipient = await recipientRepository.createQueryBuilder('Recipient')
                .update(Recipient)
                .set({ ...params })
                .where('Recipient.id = :id', { id })
                .returning('*')
                .execute();
            return recipient.raw[0];
        } catch (error) {
            logger.error('Error updating recipient:', error);
            throw error;
        }
    }

    public async getAllRecipients() {
        try {
            const recipients = await recipientRepository.createQueryBuilder('Recipient')
                .leftJoinAndSelect('Recipient.templates', 'Templates')
                .orderBy('Recipient.updated_at', 'DESC')
                .select(['Recipient', 'Templates.id'])
                .getMany();

            return recipients;
        } catch (error) {
            logger.error('Error getting recipients:', error);
            throw error;
        }
    }

    public async getRecipientById(id: string): Promise<Recipient | null> {
        try {
            const recipient = await recipientRepository.createQueryBuilder('Recipient')
                .where('Recipient.id = :id', { id })
                .getOne();

            return recipient;
        } catch (error) {
            logger.error('Error getting recipient:', error);
            throw error;
        }
    }
}