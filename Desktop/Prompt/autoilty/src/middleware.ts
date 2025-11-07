import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const PUBLIC_FILE = /\.(.*)$/;

export const config = {
  matcher: ["/((?!_next|api|static|public|manifest.webmanifest|service-worker.js).*)"]
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const pathnameParts = pathname.split("/");
  const locale = pathnameParts[1];

  if (!SUPPORTED_LANGUAGES.includes(locale as any)) {
    const preferred = request.headers.get("accept-language")?.split(",")[0].split("-")[0] ?? "en";
    const matched = SUPPORTED_LANGUAGES.includes(preferred as any) ? preferred : "en";
    return NextResponse.redirect(new URL(`/${matched}${pathname}`, request.url));
  }

  return NextResponse.next();
}


