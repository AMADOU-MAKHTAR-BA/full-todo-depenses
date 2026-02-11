import "@std/dotenv/load";
import { Application } from "@oak/oak/application";
import { send } from "@oak/oak/send";
import { dirname, fromFileUrl, join } from "@std/path";
import router from "./router.ts";
import { oakCors } from "oakCors";

const app = new Application();
const port = 8000;

// 📁 Chemin absolu vers le dossier dist (situé à la racine du projet)
const __dirname = dirname(fromFileUrl(import.meta.url));
const distPath = join(__dirname, "..", "dist"); // on remonte d'un niveau depuis backend/

// 1️⃣ Servir les fichiers statiques (JS, CSS, images)
app.use(async (ctx, next) => {
  try {
    await send(ctx, ctx.request.url.pathname, {
      root: distPath,
      index: "index.html",
    });
  } catch {
    await next(); // ce n’est pas un fichier statique → passe aux routes suivantes
  }
});

// 2️⃣ CORS – en production, les appels sont en same-origin, tu peux désactiver ou restreindre
if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  // Mode production (Deno Deploy) → pas de CORS si front/back servis ensemble
  console.log("Production mode: CORS disabled (same-origin)");
} else {
  // Développement local → CORS vers le front Vite
  app.use(
    oakCors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    })
  );
}

// 3️⃣ Logs des requêtes
app.use(async (ctx, next) => {
  console.log(`${new Date().toISOString()} - ${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// 4️⃣ Routes API
app.use(router.routes());
app.use(router.allowedMethods());

// 5️⃣ Fallback SPA : toutes les autres routes → index.html (pour React Router)
app.use(async (ctx) => {
  await send(ctx, "/index.html", { root: distPath });
});

console.log(`✅ Serveur prêt sur http://localhost:${port}`);
await app.listen({ port });