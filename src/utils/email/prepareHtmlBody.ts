import { readTemplate } from './templateReader';
import { TPrepareHtml } from './types';

const prepareHtml = async (params: TPrepareHtml): Promise<string> => {
	const { template = '', data = {} } = params;

	let html_template = await readTemplate(template);

	if (!html_template) {
		return '';
	}

	Object.keys(data).forEach((key: string) => {
		const value = data[key];
		html_template = html_template.replace(new RegExp('{{' + key + '}}', 'gi'), value);
	});

	return html_template as string;
};

export default prepareHtml;