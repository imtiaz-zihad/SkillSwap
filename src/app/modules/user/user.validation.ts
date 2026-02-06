import z from "zod";

const createLearnerValidationSchema = z.object({
  password: z.string(),
  learner: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

const createInstructorValidationSchema = z.object({
  password: z.string(),
  instructor: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().nonempty("Contact number is required"),
    bio: z.string().optional(),
    skills: z.string().nonempty("Skills are required"),
    experience: z.number().optional(),
  }),
});

const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const UserValidation = {
  createLearnerValidationSchema,
  createInstructorValidationSchema,
  createAdminValidationSchema
};
