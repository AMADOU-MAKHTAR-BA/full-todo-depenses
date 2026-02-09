import { Router } from "@oak/oak/router";
import {
  addNewDepense,
  getAllDepenses,
} from "./controllers/gestionRequetesDepenses.ts";
import { postInfoUser } from "./controllers/gestionRequetesInscpritions.ts";
const router = new Router();
// Route GET: renvoie toutes les dépenses sous forme de JSON
router.get("/api/depenses", getAllDepenses);
// inserer les depenses a la base de donnees( a la table depenses) puis sur la page
router.post("/api/depenses", addNewDepense);

router.post("/api/inscription", postInfoUser);
export default router;

// Route POST: logger des etats de chaque requete
// router.post("/depenses", loggerEtatsRequetes);
