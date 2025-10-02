import { NextFunction } from "express";
import { Request, Response, HttpCode } from "../core/constants";
import { user_role } from "../core/constants/enum";

import { Logger } from "../utils/helper";

const logger = new Logger('checkRole');

const checkRole = (allowedRoles: Array<user_role>) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const { user_role, username } = req.user!

        if (allowedRoles.includes(user_role)) {
            next();
        } else {
            logger.warn(`Forbidden access attempt by user[${username}] with profile: ${user_role}`);
            res.status(HttpCode.FORBIDDEN).send({ message: "Forbidden" });
        }
    }
}

export default checkRole