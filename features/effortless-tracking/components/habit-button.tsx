"use client";

import { useState, useTransition } from "react";
import { toggleHabitCompletion } from "../actions/toggle-habit.action";
import { cn } from "@/lib/utils";

interface HabitButtonProps {
  habitId: string;
  title: string;
  icon: string;
  color: string;
  isCompleted: boolean;
}

export function HabitButton({
  habitId,
  title,
  icon,
  color,
  isCompleted: initialCompleted,
}: HabitButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const handleClick = () => {
    // Optimistic update
    setIsCompleted((prev) => !prev);

    startTransition(async () => {
      const result = await toggleHabitCompletion(habitId);

      if (!result.success) {
        // Revert on error
        setIsCompleted((prev) => !prev);
        console.error("Failed to toggle habit:", result.error);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "group relative w-full rounded-2xl p-6 transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isCompleted
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
          : "bg-white border-2 border-gray-200 hover:border-gray-300"
      )}
      style={{
        borderColor: isCompleted ? "#10b981" : undefined,
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition-all",
            isCompleted ? "scale-110" : "scale-100"
          )}
          style={{
            backgroundColor: isCompleted ? color + "20" : color + "10",
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <div className="flex-1 text-left">
          <h3
            className={cn(
              "text-lg font-semibold transition-colors",
              isCompleted ? "text-green-700" : "text-gray-900"
            )}
          >
            {title}
          </h3>
        </div>

        {/* Checkmark */}
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full transition-all",
            isCompleted
              ? "bg-green-500 scale-100 rotate-0"
              : "bg-gray-100 scale-0 rotate-180"
          )}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Completion Animation */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-2xl bg-green-500/10 animate-pulse" />
      )}
    </button>
  );
}
