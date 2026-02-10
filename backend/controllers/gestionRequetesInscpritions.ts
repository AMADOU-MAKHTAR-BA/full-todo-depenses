import type { Context } from "@oak/oak";
import psql from "../database/dataBase.ts";
const postInfoUser = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    const body = await request.body.json();
    const { nom, prenom, email, password } = body;
    if (!nom.trim() || !prenom.trim() || !email.trim() || !password.trim()) {
      response.status = 400;
      response.body = "Error! Tous les champs sont requis!";
      return;
    }
    const existUser = await psql`SELECT * FROM users WHERE email=${email}`;
    if (existUser.length>0) {
      response.status = 409;
      response.body = "L'email fourni existe deja";
      return;
    }
    const newUsers =
      await psql`INSERT INTO users(nom , prenom , email , password)
  VALUES(${nom},${prenom},${email},${password}) RETURNING id ,nom , prenom , email ,password`;
    const addUsers = newUsers[0];
    response.status = 201;
    response.body = {
      success: true,
      data: addUsers,
    };
  } catch (error) {
    response.status = 500;
    console.error("Error serveur", error);
  }
};
export { postInfoUser };
