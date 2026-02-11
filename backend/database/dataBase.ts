import postgres from "postgres";

const DATABASE_URL = Deno.env.get("DATABASE_URL");
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL n'est pas définie dans l'environnement");
}

const psql = postgres(DATABASE_URL);

export default psql;