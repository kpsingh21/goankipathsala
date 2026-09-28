import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Normalize host: remove port if present (e.g. "hariom-public-school.localhost:3000" -> "hariom-public-school.localhost")
  const hostWithoutPort = hostname.split(":")[0];

  // Identify subdomain
  // If host is "hariom-public-school.localhost" or "hariom-public-school.goankipathsala.in"
  let subdomain: string | null = null;

  if (hostWithoutPort.endsWith(".localhost")) {
    subdomain = hostWithoutPort.replace(".localhost", "");
  } else if (hostWithoutPort.endsWith(".goankipathsala.in")) {
    subdomain = hostWithoutPort.replace(".goankipathsala.in", "");
  }

  // Prevent rewriting for root domains, static files, api routes
  if (
    !subdomain ||
    subdomain === "localhost" ||
    subdomain === "www" ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If already under /school, proceed
  if (url.pathname.startsWith("/school")) {
    return NextResponse.next();
  }

  // Rewrite request to dynamic tenant route: /school/[subdomain]
  return NextResponse.rewrite(
    new URL(`/school/${subdomain}${url.pathname === "/" ? "" : url.pathname}`, req.url)
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
