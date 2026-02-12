import postgres from "postgres";

const DATABASE_URL = Deno.env.get("DATABASE_URL");
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const psql = postgres(DATABASE_URL);
export default psql;