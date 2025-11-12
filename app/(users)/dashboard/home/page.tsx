import { HabitList } from "@/features/effortless-tracking/components/habit-list";
import { getTodayHabits } from "@/features/effortless-tracking/services/habit.service";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const HomeDashboard = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const habits = await getTodayHabits(user.id);
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* <TodayHeader /> */}
        <HabitList habits={habits} />
      </div>
    </main>
  );
};

export default HomeDashboard;
