import { Client } from "@microsoft/microsoft-graph-client"
import { ConfidentialClientApplication } from "@azure/msal-node";
import { Logger } from "../helper";
import { TAzureSendMail } from "./types";

export default class AzureEmailService {

    private clientApp: ConfidentialClientApplication
    private logger: Logger;
    private maxRetries: number;

    constructor(client_id: string, client_secret: string, tenant_id: string) {
        this.clientApp = new ConfidentialClientApplication({
            auth: {
                clientId: client_id,
                clientSecret: client_secret,
                authority: `https://login.microsoftonline.com/${tenant_id}`
            }
        });
        this.maxRetries = 2;
        this.logger = new Logger('AzureEmailService');
        this.logger.info('AzureEmailService initialized');
    }

    private async getAccessToken(): Promise<string> {
        try {
            const clientCredentialRequest = {
                scopes: ['https://graph.microsoft.com/.default'],
            };

            const response = await this.clientApp.acquireTokenByClientCredential(clientCredentialRequest);

            if(!response?.accessToken) {
                throw new Error('Failed to acquire access token');
            }

            return response?.accessToken;
        } catch (error) {
            this.logger.error('Error acquiring access token:', error);
            throw error;
        }
    }

    async sendEmail(params: TAzureSendMail): Promise<boolean> {

        const {
            senderName = '',
            body,
            fromEmail,
            subject = 'Email from Medsaver Solutions',
            toEmail = [],
            attachments = [],
            cc = [],
            bcc = []
        } = params;

        let lastError;
        
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const accessToken = await this.getAccessToken();
                const graphClient = Client.init({
                    authProvider: (done) => {
                        done(null, accessToken);
                    }
                });

                const mail = {
                    message: {
                        subject: subject,
                        body: {
                            contentType: 'Html',
                            content: body
                        },
                        toRecipients: toEmail.map((email) => ({ emailAddress: { address: email } })),
                        attachments: attachments,
                        ccRecipients: cc.length ? cc.map((email) => ({ emailAddress: { address: email } })) : [],
                        bccRecipients: bcc.length ? bcc.map((email) => ({ emailAddress: { address: email } })) : [],
                        ...(
                            senderName ? 
                            { 
                                from: { 
                                    emailAddress: { 
                                        name: senderName, 
                                        address: fromEmail 
                                    } 
                                } 
                            } : 
                            {}
                        )
                    }
                };

                await graphClient.api(`/users/${fromEmail}/sendMail`).post(mail);

                for(const recipient of toEmail) {
                    this.logger.info(`Email sent to ${recipient}`);
                }

                this.logger.info('Email sent successfully.');
                return true;
                
            } catch (error: any) {
                lastError = error;
                this.logger.info(`Attempt ${attempt + 1} failed: ${error.message}`);

                if (attempt < this.maxRetries) {
                    await this.delay(1000 * (attempt + 1));
                    continue;
                }
                
                break;
            }
        }
        
        throw lastError;
    }

    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}