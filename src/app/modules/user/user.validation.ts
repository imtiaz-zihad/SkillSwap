import z from "zod";

const createLearnerValidationSchema = z.object({
  password: z.string(),
  learner: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});
export const UserValidation = {
  createLearnerValidationSchema,
};
