declare module 'zeptomail' {
  interface ZeptoMailClientOptions {
    token: string;
    url: string;
  }

  interface SendMailPayload {
    to: any;
    from: any;
    subject?: string;
    htmlbody?: string;
    textbody?: string;
    cc?: any;
    bcc?: any;
    reply_to?: any;
  }

  interface TemplateMailPayload {
    to: any;
    from: any;
    mail_template_key: string;
    merge_info?: any;
    subject?: string;
    cc?: any;
    bcc?: any;
    reply_to?: any;
  }

  export class SendMailClient {
    constructor(options: ZeptoMailClientOptions, clientOptions?: Record<string, any>);

    sendMail(payload: SendMailPayload): Promise<any>;

    sendBatchMail(payload: SendMailPayload): Promise<any>;

    sendMailWithTemplate(payload: TemplateMailPayload): Promise<any>;

    mailBatchWithTemplate(payload: TemplateMailPayload): Promise<any>;
  }
}
