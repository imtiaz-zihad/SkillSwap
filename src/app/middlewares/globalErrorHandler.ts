import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../generated/prisma/client";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        message = "Duplicate key error!";
        error = err.meta || err.message;
        statusCode = httpStatus.CONFLICT;
        break;
      case "P1000":
        message = "Authentication failed against server!";
        error = err.meta || err.message;
        statusCode = httpStatus.BAD_GATEWAY;
        break;
      case "P2003":
        message = "Foreign key constraint failed!";
        error = err.meta || err.message;
        statusCode = httpStatus.BAD_REQUEST;
        break;
      default:
        message = "Prisma known request error";
        error = err.meta || err.message;
        statusCode = httpStatus.BAD_REQUEST;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Unknown Prisma Error";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = "Prisma client failed to initialize";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  }

  console.error(err); // optional: log full error for debugging
  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
