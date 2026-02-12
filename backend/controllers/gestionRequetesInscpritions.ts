import { Context } from "@oak/oak";
import psql from "../database/dataBase.ts";
import { createAccessToken, createRefreshToken } from "../auth/jwt.ts";
import { hashPassword } from "../auth/hashage.ts";

const postInfoUser = async (ctx: Context) => {
  const { response, request } = ctx;

  try {
    const body = await request.body.json();
    const { nom, prenom, email, password } = body;

    if (
      !nom?.trim() ||
      !prenom?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      response.status = 400;
      response.body = "Tous les champs sont requis";
      return;
    }

    const existUser = await psql`
      SELECT id FROM users WHERE email=${email}
    `;

    if (existUser.length > 0) {
      response.status = 409;
      response.body = "Email déjà utilisé";
      return;
    }

    const hashedPassword = await hashPassword(password);

    const result = await psql`
      INSERT INTO users (nom, prenom, email, hashed_password)
      VALUES (${nom}, ${prenom}, ${email}, ${hashedPassword})
      RETURNING id, email
    `;

    const user = result[0];

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
      secure: true,
      maxAge: 60 * 5,
      path: "/",
    });

    ctx.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    ctx.response.status = 201;
    ctx.response.body = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nom:user.nom,
        prenom:user.prenom
      },
    };
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.body = "Erreur serveur";
  }
};

export { postInfoUser };
