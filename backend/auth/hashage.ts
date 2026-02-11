// auth/password.ts
import { hash, verify } from "@felix/bcrypt";

// hash du mot de passe
export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

// vérification du mot de passe
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await verify(password, hashedPassword);
}

