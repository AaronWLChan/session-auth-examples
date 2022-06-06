import { NextFunction, Request, Response } from "express";

export function validateSession(req: Request, res: Response, next: NextFunction){
    
    if (!req.session || !req.session.userId){
        return res.sendStatus(401)
    }

    return next()

}

