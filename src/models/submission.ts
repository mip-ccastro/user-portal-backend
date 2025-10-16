import { Form } from "../entity/Form";
import { Logger } from "../utils/helper";
import { Submission } from "../entity/Submission";
import { User } from "../entity/User";
import dataSource from "../core/config/data-source";

const logger = new Logger('SubmissionModel');
const submissionRepository = dataSource.getRepository(Submission);

export default class SubmissionModel {
    public async createSubmission(params: any): Promise<Submission> {
        try {
            return dataSource.transaction(async (transactionalEntityManager) => {
                const { user_id, form_id, submission_data } = params;

                const user = await transactionalEntityManager.createQueryBuilder(User, 'User')
                    .where('User.user_id = :user_id', { user_id })
                    .getOne();

                if (!user) {
                    throw new Error('User not found');
                }

                const form = await transactionalEntityManager.createQueryBuilder(Form, 'Form')
                    .where('Form.id = :form_id', { form_id })
                    .getOne();
                
                if (!form) {
                    throw new Error('Form not found');
                }
                
                const submission = transactionalEntityManager.create(Submission, {
                    submission_data,
                    user,
                    form
                });

                return await transactionalEntityManager.save(submission);
            })
        } catch (error) {
            logger.error('Error creating submission:', error);
            throw error;
        }
    }

    public async getAllSubmissions(): Promise<Submission[]> {
        try {
            const submissions = await submissionRepository.createQueryBuilder('Submission')
                .leftJoinAndSelect('Submission.user', 'user')
                .leftJoinAndSelect('Submission.form', 'form')
                .orderBy('Submission.created_at', 'DESC')
                .getMany();

            return submissions;
        } catch (error) {
            logger.error('Error getting submissions:', error);
            throw error;
        }
    }
}