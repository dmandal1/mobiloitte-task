import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middlewares/async';
import User from '../models/User';
import redisClient from '../services/redisService';
import { publishToQueue } from '../services/rabbitmqService';

// @desc      Get all users
// @route     GET /api/v1/users
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;

    const cacheKey = `users:page=${page}:limit=${limit}`;
    const cachedUsers = await redisClient.get(cacheKey);
    if (cachedUsers) {
      return res.status(200).json({
        success: true,
        count: JSON.parse(cachedUsers).length,
        data: JSON.parse(cachedUsers),
      });
    }

    const user = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), 600);
    }

    res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });
  }
);

// @desc      Get single user
// @route     GET /api/v1/users/:id
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `user:${req.params.id}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedUser),
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }

    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), 600);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc      Create user
// @route     POST /api/v1/users
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password });
    await newUser.save();

    await publishToQueue('user_operations', {
      operation: 'create',
      data: newUser,
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  }
);

// @desc      Update user
// @route     PUT /api/v1/users/:id
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await publishToQueue('user_operations', {
      operation: 'update',
      data: user,
    });

    const cacheKey = `user:${req.params.id}`;
    
    await redisClient.del(cacheKey);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.params.id);

    const cacheKey = `user:${req.params.id}`;
    await redisClient.del(cacheKey);

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);
