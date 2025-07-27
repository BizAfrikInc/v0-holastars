import { z } from 'zod';

export const EmailAddressSchema = z.object({
  address: z.string().email('Invalid email address'),
  name: z.string().optional(),
});

export const RecipientEmailAddressSchema = z.object({
  email_address: EmailAddressSchema,
});

export const EmailOptionsSchema = z.object({
  to: z.array(RecipientEmailAddressSchema).min(1, 'At least one recipient required'),
  from: EmailAddressSchema,
  replyTo: z.array(EmailAddressSchema).optional(),
  subject: z.string().min(1, 'Subject is required'),
  htmlbody: z.string().optional(),
  textbody: z.string().optional(),
  cc: z.array(RecipientEmailAddressSchema).optional(),
  bcc: z.array(RecipientEmailAddressSchema).optional(),
})

export const TemplateEmailOptionsSchema = z.object({
  to: z.array(RecipientEmailAddressSchema).min(1, 'At least one recipient required'),
  from: EmailAddressSchema,
  mail_template_key: z.string().min(1, 'Template key is required'),
  merge_info: z.record(z.string(), z.unknown()).optional(),
  cc: z.array(RecipientEmailAddressSchema).optional(),
  bcc: z.array(RecipientEmailAddressSchema).optional(),
  subject: z.string().optional(),
  replyTo: z.array(EmailAddressSchema).optional(),
});

export const EmailRequestSchema = z.discriminatedUnion('type', [
  EmailOptionsSchema.extend({
    type: z.literal('single'),
  }),
  EmailOptionsSchema.extend({
    type: z.literal('batch'),
  }),
  TemplateEmailOptionsSchema.extend({
    type: z.literal('template'),
  }),
  TemplateEmailOptionsSchema.extend({
    type: z.literal('batch-template'),
  }),
]);

export type EmailRequest = z.infer<typeof EmailRequestSchema>;
export type ValidatedEmailOptions = z.infer<typeof EmailOptionsSchema>;
export type  ValidatedTemplateEmailOptions = z.infer<typeof TemplateEmailOptionsSchema>;

