"use server";

import { login, deleteSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    await login(email, password);
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
  
  // Redirect after successful login (this throws NEXT_REDIRECT which is expected)
  redirect("/dashboard");
}

export async function signOutAction() {
  await deleteSession();
  // Redirect after logout (this throws NEXT_REDIRECT which is expected)
  redirect("/login");
}

