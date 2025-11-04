"use client";

import {
  IconChartBar,
  IconDashboard,
  IconListDetails,
} from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { useMenu } from "@/context/menu-context";

const iconMap = {
  dashboard: IconDashboard,
  list: IconListDetails,
  chart: IconChartBar,
} as const;

export type NavItem = {
  title: string;
  url: string;
  icon: keyof typeof iconMap;
};

export function NavMain({ items }: { items: NavItem[] }) {
  const { activeMenu, setActiveMenu } = useMenu();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={activeMenu === item.title}>
                <Link href={item.url} onClick={() => setActiveMenu(item.title)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
