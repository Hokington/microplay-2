import { isLoggedIn, isAdmin } from "./auth";

export function onRequest (context, next) {
    const cookie = context.request.headers.get("cookie");
    if (context.url.pathname === "/cart" && !isLoggedIn(cookie)) {
        return Response.redirect(new URL("/login?msg=denied", context.url), 302);
    }
  
    if (context.url.pathname.startsWith("/admin") && !isAdmin(cookie)) {
        return Response.redirect(new URL("/", context.url), 302);
    }
    
    return next();
};