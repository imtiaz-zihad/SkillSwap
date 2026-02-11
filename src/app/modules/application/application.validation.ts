import z from "zod";

const createApplicationValidationSchema = z.object({
  problemId: z.string().uuid(),
  note: z.string().optional(),
});

export const ApplicationValidation = {
  createApplicationValidationSchema,
};
