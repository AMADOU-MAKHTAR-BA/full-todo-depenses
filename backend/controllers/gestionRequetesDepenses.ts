import { Context } from "@oak/oak";
import psql from "../database/dataBase.ts";
// @desc get all depenses 
// @route GET /depenses
const getAllDepenses = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const allDepenses = await psql`SELECT * FROM depenses ORDER BY date DESC`;
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
    if (!name.trim() || !name || name == undefined || prix == null) {
      response.status = 400;
      response.body = "Error! nom et prix sont requis!";
      return;
    }
    const addDepense =
      await psql`INSERT INTO depenses (name , prix) VALUES(${name},${prix}) RETURNING id , name , prix , date`;
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
export { getAllDepenses, addNewDepense };
