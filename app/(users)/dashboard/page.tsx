import { getCurrentUser } from "@/features/auth/actions/auth.action";
import UserMenu from "@/features/auth/components/user-menu";

const DashboardPage = async () => {
  const user = await getCurrentUser();
  return (
    <div>
      {" "}
      <div className="container flex items-center justify-between h-16">
        <h1 className="text-xl font-bold">Dashboard</h1>
        {user && <UserMenu user={user} />}
      </div>
    </div>
  );
};

export default DashboardPage;
