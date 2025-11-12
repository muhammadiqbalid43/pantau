import z from "zod";

export const habitSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(5).max(50),
  description: z.string().nullable(),
  frequency: z.enum(["daily", "weekly", "custom"]).default("daily"),
  target_days: z.array(z.number()).nullable(),
  reminder_time: z.string().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string(),
  is_active: z.boolean().default(true),
  archived_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const habitLogSchema = z.object({
  id: z.string().uuid(),
  habit_id: z.string().uuid(),
  user_id: z.string().uuid(),
  date: z.string(), // YYYY-MM-DD format
  completed_at: z.string(),
  recovery_used: z.boolean().default(false),
  note: z.string().nullable(),
  mood: z.number().int().min(1).max(5).nullable(),
  created_at: z.string(),
});

export const habitWithCompletionSchema = habitSchema.extend({
  isCompletedToday: z.boolean(),
});

export const createHabitInputSchema = z.object({
  title: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name is too long"),
  description: z.string().optional().or(z.literal("")),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color"),
});

export const updateHabitInputSchema = createHabitInputSchema.partial().extend({
  id: z.string().uuid(),
});

export const createHabitLogInputSchema = z.object({
  habit_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  note: z.string().optional(),
  mood: z.number().int().min(1).max(5).optional(),
});

export type HabitFormData = z.infer<typeof habitSchema>;
export type HabitLogFormData = z.infer<typeof habitLogSchema>;
export type HabitWithCompletionFormData = z.infer<
  typeof habitWithCompletionSchema
>;
export type CreateHabitFormData = z.infer<typeof createHabitInputSchema>;
export type UpdateHabitFormData = z.infer<typeof updateHabitInputSchema>;
export type CreateHabitLogFormData = z.infer<typeof createHabitLogInputSchema>;
