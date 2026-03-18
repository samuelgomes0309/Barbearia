import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("@barberpro.token")?.value;
	const { pathname } = request.nextUrl;
	const guestRoutes = ["/login", "/register"];
	const privateRoutes = ["/dashboard", "/schedule", "/subscription"];
	// 🔁 HOME
	if (pathname === "/") {
		return NextResponse.redirect(
			new URL(token ? "/dashboard" : "/login", request.url)
		);
	}
	// 🚫 Não logado em rota privada
	if (!token && privateRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	// 🔄 Logado em rota de visitante
	if (token && guestRoutes.includes(pathname)) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/",
		"/dashboard/:path*",
		"/schedule/:path*",
		"/subscription/:path*",
		"/login",
		"/register",
	],
};
