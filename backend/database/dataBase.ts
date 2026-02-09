import postgres from "postgres";

const psql = postgres({
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
  host: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT")),
});

export default psql;




/******************
 * 
 * 
 * 
 * 
 * const loggerEtatsRequetes = async (ctx:Context) => {
  try {
    console.log("Requête POST reçue");

    const body = await ctx.request.body.json();
    const { name, prix } = body;

    console.log("Données reçues :", body);

    if (!name || prix === null || prix === undefined) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Nom et prix requis" };
      return;
    }

    const result = await psql`
      INSERT INTO depenses (name, prix)
      VALUES (${name}, ${prix})
      RETURNING id, name, prix, date
    `;

    ctx.response.status = 201;
    ctx.response.body = result[0];
  } catch (error) {
    console.error("Erreur POST /depenses :", error);

    if (error instanceof Error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: "Erreur serveur inconnue" };
    }
  }
}*** */