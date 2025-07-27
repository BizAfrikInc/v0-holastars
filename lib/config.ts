import '@/envConfig'
function getEnvVariable(key: string, isPublic = false): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  if (isPublic && !key.startsWith("NEXT_PUBLIC_")) {
    throw new Error(`Public variable ${key} must start with NEXT_PUBLIC_`);
  }

  return value;
}

export const config = {
  public: {
    emailJsPublicKey: getEnvVariable("NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY", true),
    emailJsServiceId: getEnvVariable("NEXT_PUBLIC_EMAIL_JS_SERVICE_ID", true),
    contactTemplateId: getEnvVariable("NEXT_PUBLIC_CONTACT_EMAILJS_TEMPLATE_ID", true),
    waitlistTemplateId: getEnvVariable("NEXT_PUBLIC_WAITLIST_EMAILJS_TEMPLATE_ID", true),
    siteUrl: getEnvVariable("NEXT_PUBLIC_SITE_URL", true),
    joinWaitlist: getEnvVariable("NEXT_PUBLIC_JOIN_WAITLIST", true),
    systemEmail: getEnvVariable("NEXT_PUBLIC_SYSTEM_EMAIL"),
    registrationTemplateKey: getEnvVariable("NEXT_PUBLIC_REGISTRATION_TEMPLATE_KEY"),
    resetPasswordTemplateKey: getEnvVariable("NEXT_PUBLIC_RESET_PASSWORD_TEMPLATE_KEY"),
    systemEmailsRecipientEmail: getEnvVariable("NEXT_PUBLIC_SYSTEM_EMAIL_RECIPIENT_EMAIL"),
    systemEmailsRecipientName: getEnvVariable("NEXT_PUBLIC_SYSTEM_EMAIL_RECIPIENT_NAME"),
  },

  server: {
    logFileRetentionDays: parseInt(getEnvVariable("LOG_FILE_RETENTION_DAYS")),
    postgresUrl: getEnvVariable("POSTGRES_URL"),
    cronSecret: getEnvVariable("CRON_SECRET"),
    logFileRetention: getEnvVariable("LOG_FILE_RETENTION_DAYS"),
    authGoogleId: getEnvVariable("AUTH_GOOGLE_ID"),
    authGoogleSecret: getEnvVariable("AUTH_GOOGLE_SECRET"),
    zeptomailApiKey: getEnvVariable("ZEPTOMAIL_API_KEY"),

  },
};
