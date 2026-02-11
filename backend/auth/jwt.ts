// Dans jwt.ts
import { create, verify, getNumericDate, type Payload } from "@djwt/jwt";

// Définir le type pour l'utilisateur
export interface User {
  id: number;
  email: string;
}

// Définir le type pour le payload du token
export interface TokenPayload extends Payload {
  user: User;
  exp: number;
}

// clé pour access token
const accessKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode("DENO_RUN_ALLOW_NET"),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);

// clé pour refresh token
const refreshKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode("DENO_RUN_ALLOW_ENV"),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);

// créer access token (court)
export async function createAccessToken(user: User): Promise<string> {
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      user,
      exp: getNumericDate(60 * 5), // 5 minutes
    },
    accessKey,
  );
}

// créer refresh token (long)
export async function createRefreshToken(user: User): Promise<string> {
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      user,
      exp: getNumericDate(60 * 60 * 24 * 7), // 7 jours
    },
    refreshKey,
  );
}

// vérifier access token
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const payload = await verify(token, accessKey);
  return payload as TokenPayload; // Cast en TokenPayload
}

// vérifier refresh token
export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  const payload = await verify(token, refreshKey);
  return payload as TokenPayload; // Cast en TokenPayload
}
