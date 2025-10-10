import jwt from 'jsonwebtoken';
import { envs } from '../core/config/env';
import { HttpCode } from '../core/constants';

export default class JwtService {
  private readonly secret: string = envs.JWT_SECRET;
  constructor() {}

  async sign(payload: any): Promise<string> {

    const token = jwt.sign(
      payload, 
      this.secret, 
      {
        expiresIn: '1D'
      }
      );

    return token;
  }

  async verify(token: string): Promise<any> {
    return jwt.verify(token, this.secret);
  }

  async authMiddleware(req: any, res: any, next: any) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = await this.verify(token);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(HttpCode.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  }
}
