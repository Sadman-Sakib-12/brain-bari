import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret = config.jwt.secret as Secret,
  expiresIn: string = config.jwt.expires_in
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyTokenHelper = (
  token: string,
  secret: Secret = config.jwt.secret as Secret
): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
