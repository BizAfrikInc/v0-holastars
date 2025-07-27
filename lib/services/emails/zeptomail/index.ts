import { SendMailClient } from 'zeptomail';
import { config } from '@/lib/config';
import { HttpException } from '@/lib/errors/api-errors';
import {
  ValidatedEmailOptions,
  ValidatedTemplateEmailOptions,
} from '@/lib/services/emails/zeptomail/types';
import { logger } from '@/lib/services/logging/logger';

class EmailService {
  private client: SendMailClient;

  constructor(apiKey: string) {
    this.client = new SendMailClient({
      url: 'api.zeptomail.com/',
      token: apiKey,
    });
  }

  private handleZeptoError(error: unknown, context: string): never {
    let zeptoMessage = 'Unknown ZeptoMail error';

    if (typeof error === 'object' && error !== null) {
      const maybeError = error as {
        error?: {
          code: string,
          details?: {
            code: string;
            message: string;
      }[];
          message?: string;
          request_id: string

        }
      }

      zeptoMessage = maybeError?.error?.message ||  zeptoMessage;
    }

    logger.error({
      message: `ZeptoMail Error - ${context}`,
      error: zeptoMessage,
      raw: error,
    });

    throw new HttpException(502, `ZeptoMail Error: ${zeptoMessage}`);
  }

  async sendSingleEmail(options: ValidatedEmailOptions) {
    try {
      return await this.client.sendMail({
        to: options.to,
        from: options.from,
        subject: options.subject,
        htmlbody: options.htmlbody,
        textbody: options.textbody,
        cc: options.cc,
        bcc: options.bcc,
        reply_to: options.replyTo,
      });
    } catch (error) {
      this.handleZeptoError(error, 'sendSingleEmail');
    }
  }

  async sendBatchEmails(options: ValidatedEmailOptions) {
    try {
      return await this.client.sendBatchMail({
        to: options.to,
        from: options.from,
        subject: options.subject,
        htmlbody: options.htmlbody,
        textbody: options.textbody,
        cc: options.cc,
        bcc: options.bcc,
        reply_to: options.replyTo,
      });
    } catch (error) {
      this.handleZeptoError(error, 'sendBatchEmails');
    }
  }

  async sendTemplateEmail(options: ValidatedTemplateEmailOptions) {
    try {
      return await this.client.sendMailWithTemplate({
        to: options.to,
        from: options.from,
        mail_template_key: options.mail_template_key,
        merge_info: options.merge_info,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        reply_to: options.replyTo,
      });
    } catch (error) {
      this.handleZeptoError(error, 'sendTemplateEmail');
    }
  }

  async sendBatchTemplateEmail(options: ValidatedTemplateEmailOptions) {
    try {
      return await this.client.mailBatchWithTemplate({
        to: options.to,
        from: options.from,
        mail_template_key: options.mail_template_key,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        reply_to: options.replyTo,
      });
    } catch (error) {
      this.handleZeptoError(error, 'sendBatchTemplateEmail');
    }
  }
}

const emailService = new EmailService(config.server.zeptomailApiKey!);

export { emailService };
