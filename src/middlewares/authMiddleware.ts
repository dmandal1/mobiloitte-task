import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from './async';
import ErrorResponse from '../utils/errorResponse';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id:string};
    req.user = await User.findById(decoded.id) as IUser;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});


