import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validateRequest = (zodSchema: ZodObject<ZodRawShape>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.body.data) {
                req.body = JSON.parse(req.body.data);
            }

            const parsedResult = zodSchema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (!parsedResult.success) {
                return next(parsedResult.error);
            }

            // sanitize
            req.body = parsedResult.data.body;
            next();
        } catch (error) {
            next(error);
        }
    };
};
