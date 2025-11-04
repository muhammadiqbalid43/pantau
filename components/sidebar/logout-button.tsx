"use client";

import { logout } from "@/features/auth/actions/auth.action";
import { useTransition } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { IconLogout } from "@tabler/icons-react";

const LogoutButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };
  return (
    <DropdownMenuItem
      onClick={handleLogout}
      disabled={isPending}
      className="text-red-600 focus:text-red-600"
    >
      <IconLogout className="mr-2 h-4 w-4" />
      {isPending ? "Logging out..." : "Log out"}
    </DropdownMenuItem>
  );
};

export default LogoutButton;
