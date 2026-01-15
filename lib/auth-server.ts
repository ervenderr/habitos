import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";
import { hashPassword, verifyPassword, getUserByEmail, createUser } from "./auth";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-key-change-in-production"
);

export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session;
}

export async function verifySession() {
  const cookie = (await cookies()).get("session")?.value;

  if (!cookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(cookie, secret);
    return payload as { userId: string; email: string };
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export async function login(email: string, password: string) {
  let user = await getUserByEmail(email);

  if (!user) {
    // Auto-create user if none exists (single-user mode)
    const passwordHash = await hashPassword(password);
    user = await createUser(email, passwordHash);
  } else {
    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid password");
    }
  }

  await createSession(user.id, user.email);
  return { id: user.id, email: user.email };
}

export async function getCurrentUser() {
  const session = await verifySession();
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
}

