import { Router } from "@oak/oak/router";
import { refreshAccessToken } from "./controllers/gestionRequetesRefresh.ts";
import {
  addNewDepense,
  getAllDepenses,
  auth,
} from "./controllers/gestionRequetesDepenses.ts";
import { postInfoUser } from "./controllers/gestionRequetesInscpritions.ts";
import { postLoginData } from "./controllers/gestionRequetesLogin.ts";
const router = new Router();
// Route GET: renvoie toutes les dépenses sous forme de JSON
router.get("/api/depenses", auth, getAllDepenses);
// inserer les depenses a la base de donnees( a la table depenses) puis sur la page
router.post("/api/depenses", auth, addNewDepense);

router.post("/api/depenses", refreshAccessToken);
router.post("/api/inscription", postInfoUser);
router.post("/api/login", postLoginData);
export default router;

// Route POST: logger des etats de chaque requete
// router.post("/depenses", loggerEtatsRequetes);
