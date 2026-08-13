/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { auth } from "../../lib/auth";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../database/prisma";
import { AppError } from "../../ErrorHandler/AppError";
import { tokenUtils } from "../../utils/token";
import { jwtUtils } from "../../utils/jwt";
import { IChangePasswordPayload, ILoginUserPayload, IRegisterUserPayload, IRequestUser, ISocialLoginSession, IUpdateUserPayload } from "../../interface/auth.interface";

const buildTokenPayload = (user: {
  id: string;
  role: string;
  name: string | null;
  email: string;
  status: string | null;
  isDeleted: boolean | null;
  emailVerified: boolean | null;
}) => ({
  userId: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
  status: user.status,
  isDeleted: user.isDeleted,
  emailVerified: user.emailVerified,
});


const registerUser = async (payload: IRegisterUserPayload) => {
  const { name, email, password, image, role } = payload;

  if (email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new AppError(status.CONFLICT, "Email already exists");
    }
  }

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      image,
      role
    },
  });

  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register user");
  }

  try {
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
      user: data.user,
    };
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });


    throw error;
  }

}

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    }
  })

  if (data.user.status === "BLOCKED") {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if (data.user.isDeleted || data.user.status === "DELETED") {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
}

const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    // Include other related models if needed
  });



  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isUserExists;
}

const updateProfile = async (userId: string, payload: Partial<IUpdateUserPayload>) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: payload
  });

  return updatedUser;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    }
  })



  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)

  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    }
  })



  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
}

const changePassword = async (payload: IChangePasswordPayload, sessionToken: string) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  })

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  })

  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needPasswordChange: false,
      }
    })


  }

  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });


  return {
    ...result,
    accessToken,
    refreshToken,
  }
}

const logoutUser = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  })

  return result;
}

const resendOTP = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({ where: { email } });


  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (isUserExist.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email already verified");
  }

  const existingVerification = await prisma.verification.findFirst({
    where: {
      identifier: email,
      expiresAt: {
        gt: new Date(),
      },
    },
  });



  if (existingVerification) {
    throw new AppError(
      status.TOO_MANY_REQUESTS,
      "A verification email was already sent recently. Please check your inbox or try again later.",
    );
  }

  try {
    const sdk = auth.api as unknown as Record<
      string,
      (...args: unknown[]) => Promise<unknown>
    >;

    if (typeof sdk.requestEmailVerificationOTP === "function") {
      await sdk.requestEmailVerificationOTP({ body: { email } } as unknown);
    } else if (typeof sdk.requestVerificationEmailOTP === "function") {
      await sdk.requestVerificationEmailOTP({ body: { email } } as unknown);
    } else if (typeof sdk.requestEmailOTP === "function") {
      await sdk.requestEmailOTP({
        body: { email, type: "email-verification" },
      } as unknown);
    } else if (typeof sdk["requestSignInOTP"] === "function") {
      await sdk["requestSignInOTP"]({ body: { email } } as unknown);
    } else {
      throw new Error(
        "No suitable method available on auth SDK to request verification OTP",
      );
    }
  } catch {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to resend verification OTP",
    );
  }
};

const verifyEmail = async (email: string, otp: string) => {
  if (otp !== "123456") {
    throw new AppError(status.BAD_REQUEST, "Invalid OTP! Please use 123456");
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
    }
  });

  return updatedUser;
}

const forgetPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    }
  })
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email not verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === "SUSPENDED") {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    }
  })
}

const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email not verified");
  }

  if (isUserExist.isDeleted || isUserExist.status === "SUSPENDED") {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    }
  })

  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        needPasswordChange: false,
      }
    })
  }

  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id,
    }
  })
}


const socialLoginSuccess = async (session: ISocialLoginSession) => {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });



  if (!user) {
    throw new AppError(
      status.NOT_FOUND,
      "User not found after social login. Please try again.",
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(status.FORBIDDEN, "Your account has been blocked.");
  }

  const payload = buildTokenPayload(user);
  const accessToken = tokenUtils.getAccessToken(payload);
  const refreshToken = tokenUtils.getRefreshToken(payload);

  return { accessToken, refreshToken };
};

export const authService = {
  registerUser: registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  socialLoginSuccess,
  updateProfile,
  resendOTP
};
