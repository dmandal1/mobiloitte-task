import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiter to all the requests
const applyRateLimit = (req: Request, res: Response, next: NextFunction) => {
    limiter(req, res, next);
}

export default applyRateLimit;
