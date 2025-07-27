import { z } from "zod";
import { createModelSchemas } from "@/lib/db"

export const jsonResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
  data: z.any().optional(),
});
export type JsonResponse = z.infer<typeof jsonResponseSchema>;

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const signupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(3),
});
export type SignupRequest = z.infer<typeof signupRequestSchema>;

export const authResponseSchema = jsonResponseSchema.extend({
  data: z.object({
    email: z.string().email(),
  }),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const UserRolesPermissionsResponseSchema = jsonResponseSchema.extend({
  data: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string().email(),
    profileImage: z.string().nullable().optional(),
    roles: z.array(z.object({
      roleId: z.number(),
      roleName: z.string(),
    })),
    rolePermissions: z.array(z.object({
      permissionId: z.number(),
      permissionName: z.string(),
    })),
    userPermissions: z.array(z.object({
      permissionId: z.number(),
      permissionName: z.string(),
    })),
    registeredBusiness: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }).optional()
  })
});
export type UserRolesPermissionsResponse = z.infer<typeof UserRolesPermissionsResponseSchema>;


export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

export const fetchUserRolesPermissionRequestSchema = z.object({
  email: z.string().email(),
});
export type UserRolesPermissionRequest = z.infer<typeof fetchUserRolesPermissionRequestSchema>;


export const resetPasswordRequestSchema = z.object({
  token: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;


export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export const verifyEmailSchema = z.string();

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;

export const businessSchemas = createModelSchemas("businesses");
export const locationSchemas = createModelSchemas("locations");
export const departmentSchemas = createModelSchemas("departments");
export const userSchemas = createModelSchemas("users");
export const planSchemas = createModelSchemas("plans");
export const userPlanSchemas = createModelSchemas("userPlans");
export const subscriptionSchemas = createModelSchemas("subscriptions");
export const planPermissionSchemas = createModelSchemas("planPermissions");
export const customerSchemas = createModelSchemas("customers");
export const feedbackTemplateSchemas = createModelSchemas("feedbackTemplates");
export const templateQuestionSchemas = createModelSchemas("templateQuestions");
export const questionAnswerSchemas = createModelSchemas("questionAnswers");
export const feedbackRequestSchemas  = createModelSchemas("feedbackRequests");
export const feedbackResponseSchemas = createModelSchemas("feedbackResponses");




export const insertUserSchema = userSchemas.insert.omit({ id: true });
export const updateUserSchema = userSchemas.update.partial().omit({ id: true });
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type CreateUserRequest = z.infer<typeof insertUserSchema>;

export const insertDepartmentSchema = departmentSchemas.insert.omit({ id: true });
export const updateDepartmentSchema = departmentSchemas.update.partial().omit({ id: true });
export type CreateDepartmentRequest = z.infer<typeof insertDepartmentSchema>;
export type UpdateDepartmentRequest = z.infer<typeof updateDepartmentSchema>;


export const insertLocationSchema = locationSchemas.insert.omit({ id: true });
export const updateLocationSchema = locationSchemas.update.partial().omit({ id: true });
export type CreateLocationRequest = z.infer<typeof insertLocationSchema>;
export type UpdateLocationRequest = z.infer<typeof updateLocationSchema>;

export const insertBusinessSchema = businessSchemas.insert.omit({ id: true });
export const updateBusinessSchema = businessSchemas.update.partial().omit({ id: true });
export type CreateBusinessRequest = z.infer<typeof insertBusinessSchema>;
export type UpdateBusinessRequest = z.infer<typeof updateBusinessSchema>;

export const insertCustomerSchema = customerSchemas.insert.omit({ id: true });
export const updateCustomerSchema = customerSchemas.update.partial().omit({ id: true });

export type CreateCustomerRequest = z.infer<typeof insertCustomerSchema>;
export type UpdateCustomerRequest = z.infer<typeof updateCustomerSchema>;

export const insertFeedbackTemplateSchema = feedbackTemplateSchemas.insert.omit({ id: true });
export const updateFeedbackTemplateSchema = feedbackTemplateSchemas.update.partial().omit({ id: true });

export type CreateFeedbackTemplateRequest = z.infer<typeof insertFeedbackTemplateSchema>;
export type UpdateFeedbackTemplateRequest = z.infer<typeof updateFeedbackTemplateSchema>;


export const insertTemplateQuestionSchema = z.array(templateQuestionSchemas.insert.omit({ id: true })).min(1)
export const updateTemplateQuestionSchema = templateQuestionSchemas.update.partial().omit({ id: true });
export const  selectTemplateQuestonSchema = templateQuestionSchemas.select

export type CreateFeedbackTemplateQuestionRequest = z.infer<typeof insertTemplateQuestionSchema>;
export type UpdateTemplateQuestionRequest = z.infer<typeof updateTemplateQuestionSchema>;

export const createTemplateWithQuestionsSchema = z.object({
  feedbackTemplate: insertFeedbackTemplateSchema,
  feedbackTemplateQuestions: z.array(templateQuestionSchemas.insert.omit({ id: true, templateId: true })).min(1) ,
});

export type CreateTemplateWithQuestionsDTO =
  z.infer<typeof createTemplateWithQuestionsSchema>;

export const insertAnswerSchema = questionAnswerSchemas.insert.omit({ id: true });
export const updateAnswerSchema = questionAnswerSchemas.update.partial().omit({ id: true });

export const insertRequestSchema  = feedbackRequestSchemas.insert.omit({ id: true });
export const updateRequestSchema  = feedbackRequestSchemas.update.partial().omit({ id: true });
export const insertResponseSchema = feedbackResponseSchemas.insert.omit({ id: true });
export const updateResponseSchema = feedbackResponseSchemas.update.partial().omit({ id: true });


export type CreateFeedbackRequestDTO = z.infer<typeof insertRequestSchema>;
export type UpdateFeedbackRequestDTO = z.infer<typeof updateRequestSchema>;







