import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(email: string, passwordHash: string) {
  try {
    // Check if user already exists (single-user restriction)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    return await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

