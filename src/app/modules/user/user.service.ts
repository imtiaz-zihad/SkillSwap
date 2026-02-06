import { Request } from "express";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { prisma } from "../../shares/prisma";
import { fileUploader } from "../../helper/fileUploder";

const createLearner = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.learner.profilePhoto = uploadResult?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round),
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.learner.email,
        password: hashPassword,
      },
    });
    return await tnx.learner.create({
      data: req.body.learner,
    });
  });

  return result;
};
export const UserService = {
  createLearner,
};
