import {
  PrismaClient,
  type ResetPassword,
  type Prisma,
  type User,
} from "@prisma/client";
import config from "config";
import { type Tokens } from "token";
import { signJwt } from "../utils/jwt";

export const excludedFields: string[] = [
  "password",
  "verified",
  "verificationCode",
];

const prisma = new PrismaClient();

export const registerUser = async (
  input: Prisma.UserCreateInput
): Promise<User> => {
  return await prisma.user.create({
    data: input,
  });
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
): Promise<User> => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const signTokens = (user: Prisma.UserCreateInput): Tokens => {
  // 1. Create Session
  // redisClient.set(`${user.id}`, JSON.stringify(user), {
  //   EX: config.get<number>('redisCacheExpiresIn') * 60,
  // });

  // 2. Create Access and Refresh tokens

  const accessToken = signJwt({ id: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  const refreshToken = signJwt({ id: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
  });

  return { accessToken, refreshToken };
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  return await prisma.user.update({
    where,
    data,
  });
};

export const deleteUsers = async (): Promise<Prisma.BatchPayload> => {
  console.log("deleting...");
  return await prisma.user.deleteMany();
};

export const requestForgotPassword = async (
  userId: string,
  token: string
): Promise<ResetPassword> => {
  // token expires in 15 minutes
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  return await prisma.resetPassword.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
};

export const findUniqueResetPassword = async (
  where: Prisma.ResetPasswordWhereUniqueInput
): Promise<
  | (ResetPassword & {
      user: User;
    })
  | null
> => {
  return await prisma.resetPassword.findUnique({
    where,
    include: {
      user: true,
    },
  });
};

export const updateResetPassword = async (
  where: Prisma.ResetPasswordWhereUniqueInput,
  data: Prisma.ResetPasswordUpdateInput
): Promise<ResetPassword> => {
  return await prisma.resetPassword.update({
    where,
    data,
  });
};

export const getAllUsersService = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserbyId = async (
  where: Prisma.UserWhereUniqueInput
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where,
  });
};

export const updateUserProfileService = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  return await prisma.user.update({
    where,
    data,
  });
};
