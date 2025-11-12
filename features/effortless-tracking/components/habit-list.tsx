"use client";

import { useState } from "react";
import { HabitWithCompletionFormData } from "../schemas/habit.schema";
import { HabitButton } from "./habit-button";
import EmptyState from "./empty-state";
import CreateHabitDialog from "./create-habit-dialog";

interface HabitListProps {
  habits: HabitWithCompletionFormData[];
}

export function HabitList({ habits }: HabitListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (habits.length === 0) {
    return (
      <>
        <EmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
        <CreateHabitDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className={habits.length === 0 ? "min-h-[400px]" : "min-h-[200px]"}>
        {habits.length === 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <EmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {habits.map((habit, index) => (
              <div
                key={habit.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <HabitButton
                  habitId={habit.id}
                  title={habit.title}
                  icon={habit.icon}
                  color={habit.color}
                  isCompleted={habit.isCompletedToday}
                />
              </div>
            ))}

            {habits.length < 5 && (
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="w-full rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all group animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${habits.length * 50}ms` }}
              >
                <div className="flex items-center justify-center gap-3 text-gray-600 group-hover:text-blue-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="font-medium">Add New Habit</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      <CreateHabitDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  );
}
