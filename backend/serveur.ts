import "@std/dotenv/load";

import { Application } from "@oak/oak/application";
import router from "./router.ts";
import { oakCors } from "oakCors";
const app = new Application();
const port = 8000; // Autoriser le front (développement) 
app.use(
  oakCors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,  // 🔥 OBLIGATOIRE pour envoyer/recevoir les cookies
  }),
);// l'affichage de chaque nouvelle requete 
app.use(async (ctx, next) => { console.log(`${new Date().toISOString()} - ${ctx.request.method} ${ctx.request.url}`); await next(); }); 
app.use(router.routes()); 
app.use(router.allowedMethods()); 
console.log(`Serveur lancé sur le port http://localhost:${port}/api/depenses`); 
await app.listen({ port });
