import Joi from 'joi';
import ErrorResponse from '../utils/errorResponse';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .max(20)
      .message(
        'Password length must be less than or equal to 20 characters long.'
      )
      .min(8)
      .message('Password length must be at least 8 characters long.')
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$'
        )
      )
      .message(
        'Password must contain at least one uppercase, one lowercase, one number, and one special character.'
      ),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new ErrorResponse(error.message, 400));
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new ErrorResponse(error.message, 400));
  next();
};

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .max(20)
      .message(
        'Password length must be less than or equal to 20 characters long.'
      )
      .min(8)
      .message('Password length must be at least 8 characters long.')
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$'
        )
      )
      .message(
        'Password must contain at least one uppercase, one lowercase, one number, and one special character.'
      ),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new ErrorResponse(error.message, 400));
  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string()
      .max(20)
      .message(
        'Password length must be less than or equal to 20 characters long.'
      )
      .min(8)
      .message('Password length must be at least 8 characters long.')
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$'
        )
      )
      .message(
        'Password must contain at least one uppercase, one lowercase, one number, and one special character.'
      ),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new ErrorResponse(error.message, 400));
  next();
};
