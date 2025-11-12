"use server";

import { createClient } from "@/lib/supabase/server";
import { getTodayDate } from "@/lib/utils/date.util";
import { revalidatePath } from "next/cache";
import z from "zod";

const toggleHabitInputSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID"),
});

export async function toggleHabitCompletion(habitId: string) {
  const validatedInput = toggleHabitInputSchema.safeParse({ habitId });

  if (!validatedInput.success) {
    return {
      success: false,
      error: validatedInput.error.issues[0].message,
    };
  }

  const supabase = await createClient();
  const today = getTodayDate();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: existing, error: checkError } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (checkError) {
    return { success: false, error: checkError.message };
  }

  if (existing) {
    // Uncomplete: Delete the log
    const { error: deleteError } = await supabase
      .from("habit_logs")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/");
    return { success: true, action: "uncompleted" };
  } else {
    // Complete: Insert new log
    const { error: insertError } = await supabase.from("habit_logs").insert({
      habit_id: habitId,
      user_id: user.id,
      date: today,
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/");
    return { success: true, action: "completed" };
  }
}
