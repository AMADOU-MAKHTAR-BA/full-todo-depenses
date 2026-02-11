import { Context } from "@oak/oak";
import psql from "../database/dataBase.ts";
import { verifyRefreshToken, createAccessToken } from "../auth/jwt.ts";

const refreshAccessToken = async (ctx: Context) => {
  const { response, request } = ctx;
  
  try {
    const cookie = request.headers.get("cookie") || "";
    const refreshToken = cookie.split("refreshToken=")[1]?.split(";")[0];
    
    if (!refreshToken) {
      response.status = 400;
      response.body = { error: "Refresh token manquant" };
      return;
    }
    
    // Vérifier le refresh token
    const payload = await verifyRefreshToken(refreshToken);
    
    // Vérifier qu'il correspond à celui en base
    const result = await psql`
      SELECT id, email FROM users 
      WHERE id = ${payload.user.id} 
      AND refresh_token = ${refreshToken}
    `;
    
    if (result.length === 0) {
      response.status = 401;
      response.body = { error: "Refresh token invalide" };
      return;
    }
    
    // Créer un nouvel access token
    const newAccessToken = await createAccessToken(payload.user);
    
    // Mettre à jour le cookie
    ctx.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 300,
      path: "/",
    });
    
    response.status = 200;
    response.body = { success: true };
    
  } catch (error) {
    console.error("Refresh error:", error);
    response.status = 401;
    response.body = { error: "Token invalide" };
  }
};

export { refreshAccessToken };