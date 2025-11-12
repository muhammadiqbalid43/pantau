import { createClient } from "@/lib/supabase/server";
import {
  habitSchema,
  HabitWithCompletionFormData,
  habitWithCompletionSchema,
} from "../schemas/habit.schema";
import { getTodayDate } from "@/lib/utils/date.util";
import z from "zod";

export async function getTodayHabits(
  userId: string
): Promise<HabitWithCompletionFormData[]> {
  const supabase = await createClient();
  const today = getTodayDate();

  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5);
  if (habitsError) throw habitsError;

  const validatedHabits = z.array(habitSchema).parse(habits);

  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", userId)
    .eq("date", today);

  if (logsError) throw logsError;

  const completedHabitIds = new Set(logs?.map((log) => log.habit_id) || []);

  const habitsWithCompletion = validatedHabits.map((habit) => ({
    ...habit,
    isCompletedToday: completedHabitIds.has(habit.id),
  }));

  return z.array(habitWithCompletionSchema).parse(habitsWithCompletion);
}
