"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateHabitFormData,
  createHabitInputSchema,
} from "../schemas/habit.schema";
import { createHabit } from "../actions/create-habit.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EMOJI_SUGGESTIONS } from "../constants/emoji.constant";
import { COLOR_SUGGESTIONS } from "../constants/color.constant";
import { Button } from "@/components/ui/button";

interface CreateHabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateHabitDialog = ({ isOpen, onClose }: CreateHabitDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateHabitFormData>({
    resolver: zodResolver(createHabitInputSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "✅",
      color: "#3B82F6",
    },
    mode: "onSubmit",
  });

  const watchedTitle = form.watch("title");
  const watchedIcon = form.watch("icon");
  const watchedColor = form.watch("color");

  async function onSubmit(data: CreateHabitFormData) {
    startTransition(async () => {
      const result = await createHabit(data);

      if (!result.success) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(key as keyof CreateHabitFormData, {
                message: messages[0],
              });
            }
          });
        } else {
          form.setError("root", {
            message: result.error || "Unknown error",
          });
        }
      } else {
        form.reset();
        onClose();
      }
    });
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Habit</DialogTitle>
          <DialogDescription>
            Add a new habit to track your daily progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Habit Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., Morning Exercise"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      disabled={isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>

            <Field>
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">
                      Description (optional)
                    </FieldLabel>

                    <Textarea
                      placeholder="e.g., 30 minutes workout every morning"
                      rows={3}
                      disabled={isPending}
                      className="resize-none"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>

            <Field>
              <Controller
                name="icon"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="icon">Choose Icon</FieldLabel>

                    <div className="flex flex-wrap gap-2">
                      {EMOJI_SUGGESTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => field.onChange(emoji)}
                          className={`w-12 h-12 text-2xl rounded-lg transition-all ${
                            field.value === emoji
                              ? "bg-blue-100 ring-2 ring-blue-500 scale-110"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          disabled={isPending}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>

            <Field>
              <Controller
                name="color"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="icon">Choose Color</FieldLabel>

                    <div className="flex flex-wrap gap-2">
                      {COLOR_SUGGESTIONS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={`w-12 h-12 rounded-lg transition-all ${
                            field.value === color
                              ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                          disabled={isPending}
                        />
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>
          </FieldGroup>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div
              className="flex items-center gap-4 p-4 bg-white rounded-lg border-2"
              style={{ borderColor: watchedColor + "40" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: watchedColor + "20" }}
              >
                {watchedIcon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {watchedTitle || "Your Habit Name"}
                </p>
              </div>
            </div>
          </div>

          {form.formState.errors.root && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHabitDialog;
