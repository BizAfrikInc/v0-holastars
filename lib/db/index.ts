import { createPool } from "@vercel/postgres"
import { drizzle } from "drizzle-orm/vercel-postgres"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { businesses } from "@/lib/db/schema/businesses"
import { customers } from "@/lib/db/schema/customers"
import { departments } from "@/lib/db/schema/departments"
import { feedbackRequests } from "@/lib/db/schema/feedback-requests"
import { feedbackResponses } from "@/lib/db/schema/feedback-response"
import { feedbackTemplates } from "@/lib/db/schema/feedback-template"
import { locations } from "@/lib/db/schema/locations"
import { permissions } from '@/lib/db/schema/permissions';
import { plans } from "@/lib/db/schema/plans"
import { planPermissions } from "@/lib/db/schema/plans-permission"
import { questionAnswers } from "@/lib/db/schema/question-answers"
import { roles} from '@/lib/db/schema/roles';
import { socialMediaConnections } from "@/lib/db/schema/social-media-connections"
import { subscriptions } from "@/lib/db/schema/subscriptions"
import { templateQuestions } from "@/lib/db/schema/template-questions"
import { users} from "@/lib/db/schema/users"
import { userPlans } from "@/lib/db/schema/users-plans"
import { usersRoles } from "@/lib/db/schema/users-roles"
import { verificationTokens } from "@/lib/db/schema/verification-tokens"
import { logger } from "@/lib/services/logging/logger"


type Schema = {
  users: typeof users;
  roles: typeof roles;
  permissions: typeof permissions;
  usersRoles: typeof usersRoles;
  verificationTokens: typeof verificationTokens;
  businesses: typeof businesses;
  locations: typeof locations;
  departments: typeof departments;
  plans: typeof plans;
  userPlans: typeof  userPlans;
  subscriptions: typeof subscriptions;
  planPermissions: typeof planPermissions;
  customers: typeof customers;
  feedbackTemplates: typeof feedbackTemplates;
  templateQuestions: typeof templateQuestions;
  questionAnswers: typeof questionAnswers;
  feedbackRequests: typeof feedbackRequests;
  feedbackResponses: typeof feedbackResponses;
  socialMediaConnections: typeof socialMediaConnections
};

export const schema: Schema = {
  users,
  roles,
  permissions,
  usersRoles,
  verificationTokens,
  businesses,
  locations,
  departments,
  plans,
  userPlans,
  subscriptions,
  planPermissions,
  customers,
  feedbackTemplates,
  templateQuestions,
  questionAnswers,
  feedbackRequests,
  feedbackResponses,
  socialMediaConnections,
};


let dbInstance: ReturnType<typeof drizzle>;

function getDbInstance() {
  if (!dbInstance) {
    const pool = createPool();
    dbInstance = drizzle(pool, { schema });
    logger.info({
      message: 'Database connection initialized.',
      tables: Object.keys(schema),
    });
  }
  return dbInstance;
}


// Utility to Generate Zod Schemas from Drizzle Schema
export function createModelSchemas<T extends keyof typeof schema>(tableName: T) {
  const table = schema[tableName];

  return {
    insert: createInsertSchema(table),
    select: createSelectSchema(table),
    update: createUpdateSchema(table),
    delete: createUpdateSchema(table),
  };
}



export const db = getDbInstance();
