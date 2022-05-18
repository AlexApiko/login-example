import { NextFunction, Request, Response } from 'express';
import { HttpError, UserInputError } from '../utils/http-error';

export const handleError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line
) => {
  if (error instanceof UserInputError) {
    res.status(error.statusCode).json({
      message: error.message,
      validationErrors: error.validationErrors,
    });
  } else if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
