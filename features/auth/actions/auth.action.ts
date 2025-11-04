"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginFormData, loginSchema } from "../schemas/login.schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { RegisterFormData, registerSchema } from "../schemas/register.schema";

export async function login(input: LoginFormData) {
  const validatedFields = loginSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: { _form: [error.message] }, success: false };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(input: RegisterFormData) {
  const validatedFields = registerSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { name, email, password } = validatedFields.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    return { error: { _form: [error.message] }, success: false };
  }

  // ⭐ CEK INI - Apakah session ada?
  console.log("Signup data:", data);
  console.log("Has session?", !!data.session);

  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name: name,
      role: "user",
    });

    if (profileError) {
      console.error("Profile error:", profileError);
      return {
        error: { _form: ["Create profile failed: " + profileError.message] },
        success: false,
      };
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
