import { HttpCode, Request, Response, } from "../core/constants";
import { Logger } from "../utils/helper";
import { type NextFunction } from "express";
import AuthModel from "../models/auth";
import JwtService from "../utils/auth/jwt";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const jwtService = new JwtService();
  const authModel = new AuthModel();
  const logger = new Logger('authMiddleware');

  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(HttpCode.UNAUTHORIZED).send({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = await jwtService.verify(token, 'access_token');

    const auth = await authModel.getAuthByAccessToken(token);

    if (!auth) {
      res.status(HttpCode.UNAUTHORIZED).send({ message: "Unauthorized" });
      return;
    }

    switch(auth.user.user_status) {
      case -1: // deleted
        logger.warn(`Unauthorized access attempt by deleted user[${auth.user.user_credentials.username}]`);
      break;
      case 0: // inactive
        logger.warn(`Unauthorized access attempt by inactive user[${auth.user.user_credentials.username}]`);
      break;
      case 2: // suspended
        logger.warn(`Unauthorized access attempt by suspended user[${auth.user.user_credentials.username}]`);
      break;
      default:
      break;
    }

    if(auth.user.user_status !== 1) {
      res.status(HttpCode.UNAUTHORIZED).send({ message: "Unauthorized" });
      return;
    }

    req.user = { ...decoded, user_role: auth.user.user_role };

    next();
  } catch (err) {
    logger.error('Error verifying token:', err);
    res.status(HttpCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }
}

export default authMiddleware