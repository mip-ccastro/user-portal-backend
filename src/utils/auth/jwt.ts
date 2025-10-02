import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from '../../core/config/env';
import { HttpCode } from '../../core/constants/';

type SignParams = {
  payload: any;
  type?: 'access_token' | 'refresh_token' | 'jwt_token';
  options?: SignOptions;
}

export default class JwtService {
  private readonly jwt_secret: string = envs.JWT_SECRET;
  private readonly access_token_secret: string = envs.ACCESS_TOKEN_SECRET;
  private readonly refresh_token_secret: string = envs.REFRESH_TOKEN_SECRET;
  constructor() {}

  async sign(params: SignParams): Promise<string> {

    const {
      payload,
      type = 'jwt_token',
      options = {
        expiresIn: envs.ID_TOKEN_EXPIRY
      }
    } = params
      
    const secret = {
      'access_token': this.access_token_secret,
      'refresh_token': this.refresh_token_secret,
      'jwt_token': this.jwt_secret
    }[type] || this.jwt_secret;

    //@ts-ignore
    const token = jwt.sign(
      payload, 
      secret, 
      options
    );

    return token;
  }

  async verify(token: string, type: 'access_token' | 'refresh_token' | 'jwt_token' = 'jwt_token'): Promise<any> {
    const secret = {
      'access_token': this.access_token_secret,
      'refresh_token': this.refresh_token_secret,
      'jwt_token': this.jwt_secret
    }[type] || this.jwt_secret;

    return jwt.verify(token, secret);
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
