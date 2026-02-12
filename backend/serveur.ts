import "@std/dotenv/load";
import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { dirname, fromFileUrl, join } from "@std/path";
import { oakCors } from "oakCors";
import router from "./router.ts";
import { Context } from "@oak/oak";

const app = new Application();
const port = 8000;

// 📁 Chemin absolu vers dist (racine du projet)
const __dirname = dirname(fromFileUrl(import.meta.url));
const distPath = join(__dirname, "..", "dist");
console.log("🔍 distPath =", distPath);

// -------------------------------------------------------------
// 1. SERVIR LES FICHIERS STATIQUES (avec MIME types forcés)
// -------------------------------------------------------------
const staticRouter = new Router();

try {
  // Vérifie que le dossier existe
  await Deno.stat(distPath);
  console.log("✅ Dossier dist trouvé");

  // Parcours récursif simple (racine + assets)
  for await (const entry of Deno.readDir(distPath)) {
    const fullPath = join(distPath, entry.name);
    if (entry.isFile) {
      staticRouter.get(`/${entry.name}`, async (ctx) => {
        const content = await Deno.readFile(fullPath);
        ctx.response.body = content;
        setMimeType(ctx, entry.name);
      });
    } else if (entry.isDirectory && entry.name === "assets") {
      const assetsPath = join(distPath, "assets");
      for await (const asset of Deno.readDir(assetsPath)) {
        if (asset.isFile) {
          staticRouter.get(`/assets/${asset.name}`, async (ctx) => {
            const content = await Deno.readFile(join(assetsPath, asset.name));
            ctx.response.body = content;
            setMimeType(ctx, asset.name);
          });
        }
      }
    }
  }
} catch (error) {
  console.error("❌ Erreur accès au dossier dist:", error);
}

function setMimeType(ctx: Context, filename: string) {
  if (filename.endsWith(".js")) ctx.response.type = "application/javascript";
  else if (filename.endsWith(".css")) ctx.response.type = "text/css";
  else if (filename.endsWith(".svg")) ctx.response.type = "image/svg+xml";
  else if (filename.endsWith(".png")) ctx.response.type = "image/png";
  else if (filename.endsWith(".html")) ctx.response.type = "text/html";
  else if (filename.endsWith(".json")) ctx.response.type = "application/json";
}

app.use(staticRouter.routes());
app.use(staticRouter.allowedMethods());

// -------------------------------------------------------------
// 2. CORS (uniquement local)
// -------------------------------------------------------------
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  app.use(
    oakCors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    }),
  );
}

// -------------------------------------------------------------
// 3. LOGS
// -------------------------------------------------------------
app.use(async (ctx, next) => {
  console.log(
    `${new Date().toISOString()} - ${ctx.request.method} ${ctx.request.url.pathname}`,
  );
  await next();
});

// -------------------------------------------------------------
// 4. ROUTES API
// -------------------------------------------------------------
app.use(router.routes());
app.use(router.allowedMethods());

// -------------------------------------------------------------
// 5. FALLBACK SPA (toutes les autres routes → index.html)
// -------------------------------------------------------------
app.use(async (ctx) => {
  try {
    const indexPath = join(distPath, "index.html");
    const content = await Deno.readFile(indexPath);
    ctx.response.type = "text/html";
    ctx.response.body = content;
  } catch {
    ctx.response.status = 404;
    ctx.response.body = "Not Found";
  }
});

// -------------------------------------------------------------
// DÉMARRAGE
// -------------------------------------------------------------
console.log(`✅ Serveur prêt sur http://localhost:${port}`);
await app.listen({ port });
