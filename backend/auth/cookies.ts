import { Context } from "@oak/oak"
export function getCookies(ctx: Context) {
  const cookie = ctx.request.headers.get("cookie") || "";
  const cookies: Record<string, string> = {};
  
  cookie.split(";").forEach(pair => {
    const [key, value] = pair.trim().split("=");
    if (key && value) {
      cookies[key] = value;
    }
  });
  
  return cookies;
}