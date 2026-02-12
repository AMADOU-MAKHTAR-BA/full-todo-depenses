import { Context } from "@oak/oak";
import {
  verifyAccessToken,
  verifyRefreshToken,
  createAccessToken,
} from "../auth/jwt.ts";
import psql from "../database/dataBase.ts";

async function auth(ctx: Context, next: () => Promise<unknown>) {
  try {
    const cookie = ctx.request.headers.get("cookie") || "";
    const token = cookie.split("accessToken=")[1]?.split(";")[0];
    const refreshToken = cookie.split("refreshToken=")[1]?.split(";")[0];

    // 1. Si un access token est présent, on essaie de le vérifier
    if (token) {
      try {
        const payload = await verifyAccessToken(token);
        ctx.state.user = payload.user;
        return await next(); // ✅ Token valide, on continue
      } catch (_) {
        // ❌ Token invalide ou expiré → on passe au refresh token
        console.log("Access token expiré, tentative de refresh");
      }
    }

    // 2. Si pas d'access token ou s'il est invalide, on utilise le refresh token
    if (!refreshToken) {
      throw new Error("Aucun refresh token");
    }

    // Vérifier le refresh token
    const refreshPayload = await verifyRefreshToken(refreshToken);

    // Vérifier en base de données
    const result = await psql`
      SELECT id, email FROM users 
      WHERE id = ${refreshPayload.user.id} 
      AND refresh_token = ${refreshToken}
    `;

    if (result.length === 0) {
      throw new Error("Refresh token invalide en base");
    }

    // Tout est bon → créer un nouvel access token
    const newAccessToken = await createAccessToken(refreshPayload.user);

    // Mettre à jour le cookie
    ctx.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 300, // 5 minutes
      path: "/",
    });

    ctx.state.user = refreshPayload.user;
    await next(); // ✅ Requête autorisée avec le nouveau token
  } catch (error) {
    console.error("Auth error:", error);
    ctx.response.status = 401;
    ctx.response.body = { error: "Accès refusé" };
  }
}

// @desc get all depenses
// @route GET /depenses
const getAllDepenses = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const allDepenses = await psql`SELECT * FROM depenses ORDER BY id DESC`;
    response.status = 200;
    response.type = "application/json";

    response.body = allDepenses.map((depense) => ({
      id: depense.id,
      name: depense.name,
      prix:
        typeof depense.prix === "string"
          ? parseFloat(depense.prix)
          : depense.prix,
      date: depense.date ? new Date(depense.date).toISOString() : null,
    }));
  } catch (error) {
    console.error("Error! GET /depenses", error);
    response.status = 500;
    response.body = {
      error: error instanceof Error ? error.message : "Erreur",
    };
  }
};
// @desc add a depense
// @route POST /depenses
const addNewDepense = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    const body = await request.body.json();
    const { name, prix } = body;

    if (!name?.trim() || prix == null) {
      response.status = 400;
      response.body = "Error! nom et prix sont requis!";
      return;
    }

    // Vérifier que l'utilisateur est authentifié
    if (!ctx.state.user) {
      response.status = 401;
      response.body = { error: "Utilisateur non authentifié" };
      return;
    }

    const userId = ctx.state.user.id; // Maintenant TypeScript sait que user a un id

    const addDepense = await psql`
      INSERT INTO depenses (name, prix, user_id) 
      VALUES (${name}, ${prix}, ${userId}) 
      RETURNING id, name, prix, date
    `;

    const newDepense = addDepense[0];
    response.status = 201;
    response.type = "application/json";
    response.body = {
      id: newDepense.id,
      name: newDepense.name,
      prix:
        typeof newDepense.prix === "string"
          ? parseFloat(newDepense.prix)
          : newDepense.prix,
      date: newDepense.date ? new Date(newDepense.date).toISOString() : null,
    };
  } catch (error) {
    console.error("Error! POST /depenses", error);
    response.status = 500;
    response.body = { error: error instanceof Error ? error.message : "error" };
  }
};
export { getAllDepenses, addNewDepense, auth };
