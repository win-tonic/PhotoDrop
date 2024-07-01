import { Request, Response, NextFunction, RequestHandler } from 'express';

class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorMiddleware = (controller: (req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            controller(req, res, next);
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof CustomError) {
                const { message, statusCode } = error;
                return res.status(statusCode).json({ message });
            }
            res.status(500).json({ message: 'Internal server error'});
        }
    };
};

export { errorMiddleware, CustomError};