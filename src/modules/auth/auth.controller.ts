import { Request, Response } from "express";
import status from "http-status";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";
import { authService } from "./auth.service";
import { SocialProvider } from "./auth.type";
import { catchAsync } from "../../shared/catchAsync";
import { tokenUtils } from "../../utils/token";
import { sendResponse } from "../../shared/sendResponse";
import { AppError } from "../../ErrorHandler/AppError";
import { cookieUtils } from "../../utils/cookie";

const getSocialAuthPayload = (
  provider: SocialProvider,
  redirectPath: string,
) => {
  const authBaseUrl = envVars.APP_URL || envVars.BETTER_AUTH_URL;
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${authBaseUrl}/api/v1/auth/${provider}/success?redirect=${encodedRedirectPath}`;
  const signInEndpoint = `/api/auth/sign-in/social`;

  return {
    provider,
    callbackURL,
    signInEndpoint,
  };
};

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.registerUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    status: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const loginUser = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result

    if (!token) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Session token is missing",
      );
    }

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  }
)

const getMe = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await authService.getMe(user);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "User profile fetched successfully",
      data: result,
    });
  }
)

const updateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await authService.updateProfile(id as string, payload);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

const getNewToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!refreshToken) {
      throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);

    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken,
      },
    });
  }
)

const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];

    const result = await authService.changePassword(payload, betterAuthSessionToken);

    const { accessToken, refreshToken, token } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
)

const logoutUser = catchAsync(
  async (req: Request, res: Response) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await authService.logoutUser(betterAuthSessionToken);
    cookieUtils.clearCookie(res, 'accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    cookieUtils.clearCookie(res, 'refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    cookieUtils.clearCookie(res, 'better-auth.session_token', {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "User logged out successfully",
      data: result,
    });
  }
)

const verifyEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    await authService.verifyEmail(email, otp);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Email verified successfully using static OTP",
    });
  }
)

const resendOTP = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.resendOTP(email);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Verification OTP resent successfully",
  });
});


const forgetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.forgetPassword(email);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Success! Please use the static OTP: 123456",
    });
  }
)

const resetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp, password } = req.body;
    await authService.resetPassword(email, otp, password);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Password reset successfully",
    });
  }
)

const SUPPORTED_PROVIDERS: SocialProvider[] = [
  "google",
  "github",
  "facebook",
  "twitter",
  "discord",
];

const socialLogin = catchAsync((req: Request, res: Response) => {
  const provider = req.params.provider as SocialProvider;
  const redirectPath = (req.query.redirect as string) || "/dashboard";

  if (!SUPPORTED_PROVIDERS.includes(provider)) {
    throw new AppError(
      status.BAD_REQUEST,
      `Unsupported social provider: ${provider}`,
    );
  }

  const payload = getSocialAuthPayload(provider, redirectPath);

  return sendResponse(res, {
    status: status.OK,
    success: true,
    message: `${provider} login payload generated successfully`,
    data: payload,
  });
});

const socialLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const provider = req.params.provider || "google";
  const redirectPath = (req.query.redirect as string) || "/dashboard";
  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  });

  if (!session?.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }

  let accessToken: string;
  let refreshToken: string;

  try {
    const result = await authService.socialLoginSuccess(session);
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;
  } catch (error) {
    const message =
      error instanceof AppError
        ? encodeURIComponent(error?.message)
        : "oauth_failed";
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=${message}`);
  }

  const callbackUrl = new URL(
    `${envVars.FRONTEND_URL}/api/auth/callback/${provider}`,
  );
  callbackUrl.searchParams.set("accessToken", accessToken);
  callbackUrl.searchParams.set("refreshToken", refreshToken);
  callbackUrl.searchParams.set("token", sessionToken);
  callbackUrl.searchParams.set("redirect", finalRedirectPath);

  res.redirect(callbackUrl.toString());
});

const handleOAuthError = catchAsync((req: Request, res: Response) => {
  const error = req.query.error as string || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
})


export const authController = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  socialLogin,
  socialLoginSuccess,
  handleOAuthError,
  updateProfile,
  resendOTP
};
