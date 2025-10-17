export type TSender = {
    name?: string;
    email: string;
}

export type TAttachment_NodeMailer = {
    filename: string;
    path: string;
    contentType: string;
}

export type TAttachment = {
    content: string;
    filename: string;
    type: string;
    disposition: string;
}

export type TSendMail = {
  from?: TSender | null;
  reply_to?: string;
  recipients: Array<string>;
  subject: string;
  cc?: Array<string>;
  bcc?: Array<string>;
  html: string;
  text?: string;
  attachments?: Array<TAttachment | TAttachment_NodeMailer>
};

export type TPrepareHtml = {
    template: String;
    data: Record<string, any>;
}

export type TAzureSendMail = {
    senderName?: string;
    fromEmail: string
    toEmail: Array<string>
    subject: string
    body: string
    attachments?: Array<TAzureAttachment>,
    cc?: Array<string>;
    bcc?: Array<string>;
}

export type TAzureAttachment = {
    '@odata.type': '#microsoft.graph.fileAttachment',
    name: string,
    contentType: string,
    contentBytes: string
}

export type TAzureAttachmentProvider = {
    path: string
    name: string
}