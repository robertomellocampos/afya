import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'afya-secret';
const EXPIRES_IN = '8h';

export interface JwtPayload {
  email: string;
}

export class JwtService {
  public sign(payload: JwtPayload): string {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
  }

  public verify(token: string): JwtPayload {
    return jwt.verify(token, SECRET) as JwtPayload;
  }
}
