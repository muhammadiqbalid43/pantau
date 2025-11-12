import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { NavUser } from "./nav-user";
import { NavItem, NavMain } from "./nav-main";

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: "dashboard",
    },
    {
      title: "Progress",
      url: "/dashboard/progress",
      icon: "list",
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: "chart",
    },
  ],
};

type User = {
  name: string;
  email: string;
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User | null }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Pantau</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
