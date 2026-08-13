import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";
import { Role, UserStatus } from "@prisma/client";
import { prisma } from "../database/prisma";
import { AppError } from "../ErrorHandler/AppError";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: Role[]) =>

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });



        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;



          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
          }



          if (
            user.status === UserStatus.SUSPENDED ||
            user.status === UserStatus.INACTIVE
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active.",
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is deleted.",
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {


            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource.",
            );
          }

          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            photo: user.photo
          };
        }
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No access token provided.",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        const message = verifiedToken.code === "TOKEN_EXPIRED"
          ? "Unauthorized access! Access token has expired. Please refresh your token."
          : "Unauthorized access! Invalid access token.";
        throw new AppError(status.UNAUTHORIZED, message);
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      if (!req.user) {
        const tokenData = verifiedToken.data!;

        req.user = {
          id: String(tokenData.userId || tokenData.id || ""),
          name: String(tokenData.name || ""),
          email: String(tokenData.email || ""),
          role: (tokenData.role as Role) || Role.STUDENT,
          photo: String(tokenData.photo || ""),
        };
      }

      if (!req.user?.id) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! User information is missing in the token.",
        );
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
