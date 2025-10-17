import { Logger } from '../helper';
import fs from 'fs'
import fs_promise from 'fs/promises'
import path from 'path';

export const readTemplate = async (template: String): Promise<String> => {

    const logger = new Logger('FileReader: readTemplate');
    const file_path = path.resolve(process.cwd() + `/src/resources/templates/${template}.html`)
    try {

        if(!fs.existsSync(file_path)){
            throw new Error('File does not exists');
        }

        const htmlContent = await fs_promise.readFile(file_path, { encoding: 'utf8' });
        return htmlContent;
    } catch (error) {
        logger.error(`Error reading file ${template}:`, error);
        return '';
    }
}