import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import serverApi from "./app/lib/serverApi";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accesToken")?.value;
  const url = request.nextUrl.clone();

  // Definir rutas protegidas
  const protectedRoutes = ["/dashboard"];
  const isLoginPage = url.pathname === "/";

  // Caso 1: Sin token y ruta protegida → redirigir a login
  if (!token && protectedRoutes.some(path => url.pathname.startsWith(path))) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Caso 2: Con token
  if (token) {
    try {
      // Verificar token con backend usando serverApi (que ya incluye API Key automáticamente)
      await serverApi.get("/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Si está en login con token válido → redirige a dashboard
      if (isLoginPage) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      // Si está en ruta protegida o pública, permite continuar
      return NextResponse.next();
    } catch (error) {
      // Token inválido o expirado - eliminar cookie y redirigir a login
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("accesToken");
      return response;
    }
  }

  // Caso 3: Sin token y ruta pública → continuar
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};