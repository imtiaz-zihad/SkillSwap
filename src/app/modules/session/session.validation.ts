import z from "zod";

const learnerFeedbackValidationSchema = z.object({
  solveStatus: z.enum(["SOLVED", "NOT_SOLVED"]),
});

export const SessionValidation = {
  learnerFeedbackValidationSchema,
};
