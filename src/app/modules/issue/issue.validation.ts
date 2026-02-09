import z from "zod";

const createIssueValidationSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  requiredSkill: z.string().nonempty("Skill is required"),
  coinReward: z.number().min(1, "Coin must be at least 1"),
});

export const IssueValidation = {
  createIssueValidationSchema,
};
