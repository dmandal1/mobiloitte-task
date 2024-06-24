import {Request, Response, NextFunction} from 'express';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/async';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
export const register = asyncHandler(async(req:Request, res:Response, next:NextFunction) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(new ErrorResponse('User already exists', 400));
      }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });
  sendTokenResponse(user, 201, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const login = asyncHandler(async(req:Request, res:Response, next:NextFunction) => {
    const { email, password } = req.body;
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
   // Check if password matches
   const isMatch = await user.matchPassword(password);
   if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const getMe = asyncHandler(async(req:AuthRequest, res:Response, next:NextFunction) => {
    const user = await User.findById(req.user?.id) as IUser;

  res.status(200).json({
    success: true,
    data: user
  });
});


// Get token from model, create cookie and send response
const sendTokenResponse = (user: IUser, statusCode:number, res:Response) => {
    const token = user.getSignedJwtToken();

    const options: {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
    } = {
      expires: new Date(
        Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE!) * 24 * 60 * 60 * 1000),
      ),
      httpOnly: true,
    };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  
  res
  .status(statusCode)
  .cookie('token', token, options)
  .json({
    success: true,
    token,
  });
  };