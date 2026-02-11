import { Context } from "@oak/oak";
import psql from "../database/dataBase.ts";
import { verifyPassword } from "../auth/hashage.ts";
import { createAccessToken, createRefreshToken } from "../auth/jwt.ts";

const postLoginData = async (ctx: Context) => {
  const { request, response } = ctx;

  try {
    const body = await request.body.json();
    const { email, password } = body;

    if (!email?.trim() || !password?.trim()) {
      response.status = 400;
      response.body = "Tous les champs doivent être remplis";
      return;
    }

    const result = await psql`
      SELECT id, email, hashed_password
      FROM users
      WHERE email = ${email}
    `;

    if (result.length === 0) {
      response.status = 404;
      response.body = "Aucun compte correspondant";
      return;
    }

    const user = result[0];

    const isValid = await verifyPassword(password, user.hashed_password);

    if (!isValid) {
      response.status = 403;
      response.body = "Mot de passe incorrect";
      return;
    }

    const accessToken = await createAccessToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = await createRefreshToken({
      id: user.id,
      email: user.email,
    });

    await psql`
      UPDATE users
      SET refresh_token = ${refreshToken}
      WHERE id = ${user.id}
    `;

    ctx.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 5, 
      path: "/",
    });

    ctx.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    ctx.response.status = 201;
    ctx.response.body = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.body = "Erreur serveur";
  }
};

export { postLoginData };
