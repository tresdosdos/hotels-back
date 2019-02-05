export interface JWTPayload {
  user: {
    id: number;
    name?: string;
    surname?: string;
    email?: string;
  };
  iss?: string;
  sub?: string;
  aud?: string;
  iat: number;
  exp: number;
  nbf?: number;
  jtu?: string;
}
