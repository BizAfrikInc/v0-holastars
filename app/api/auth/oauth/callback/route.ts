import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/google-auth";
import { StatusEnum } from "@/lib/db/enums";
import { userRepository } from "@/lib/db/repositories/users-repository";
import { ApiError } from "@/lib/errors/api-errors"
import { generateUsername } from "@/lib/helpers/generate-username";
import { signJwt } from "@/lib/services/jwt";
import { logger } from "@/lib/services/logging/logger";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.clone()
    const session = await auth();

    if (!session?.user?.email) {
      url.pathname = '/auth/error'
      url.searchParams.set('error', 'invalid_session')
      return NextResponse.redirect(url);
    }

    const email = session.user.email;
    const nameParts = session.user.name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const existingUser = await userRepository.findByEmail(email);

    let dbUser;

    if (!existingUser) {
      const username = await generateUsername(firstName, lastName);
      dbUser = await userRepository.create({
        email,
        username,
        firstName,
        lastName,
        provider: "google",
        status: StatusEnum.ACTIVE,
      });
    } else {
      dbUser = existingUser;
      await userRepository.update(dbUser.id, {
        firstName,
        lastName,
        status: StatusEnum.ACTIVE,
        image: session.user.image,
      });
    }

    if (!dbUser) {
      url.pathname = '/error'
      url.searchParams.set('type', 'user_creation_failed')
      return NextResponse.redirect(url);
    }


    const jwt = await signJwt({ userId: dbUser.id, email });
    url.pathname = '/dashboard'
    url.searchParams.set('token', encodeURI(dbUser.email));
    const response = NextResponse.redirect(url);
    response.cookies.set("auth_token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });


    return response;
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Google Auth Callback Error",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });

    const url = req.nextUrl.clone()
    url.pathname = '/error'
    url.searchParams.set('type', 'auth_exception')
    return NextResponse.redirect(url);
  }
}
