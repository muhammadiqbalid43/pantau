"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateHabitFormData,
  createHabitInputSchema,
} from "../schemas/habit.schema";
import { revalidatePath } from "next/cache";

export async function createHabit(input: CreateHabitFormData) {
  const validatedInput = createHabitInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      error: validatedInput.error.issues[0].message,
      fieldErrors: validatedInput.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // Ensure profile exists
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      name:
        user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  // Check if user already has 5 habits (MVP limit)
  const { count } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .is("archived_at", null);

  if (count && count >= 5) {
    return {
      success: false,
      error: "Maximum 5 habits allowed. Archive a habit first!",
    };
  }

  // Insert habit
  const { data, error } = await supabase
    .from("habits")
    .insert({
      ...validatedInput.data,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true, data };
}
