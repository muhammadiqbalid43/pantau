import { AppSidebar } from "@/components/sidebar/app-sidebar";
import BottomNav from "@/components/sidebar/bottom-nav";
import SiteHeader from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MenuProvider } from "@/context/menu-context";
import { getCurrentUser } from "@/features/auth/actions/auth.action";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseUser = await getCurrentUser();

  if (!supabaseUser) {
    redirect("/login");
    return; // Tambahkan return (meskipun tidak akan pernah tercapai)
  }

  // Transform Supabase User ke format yang dibutuhkan
  const user = {
    name:
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    email: supabaseUser.email || "",
    avatar:
      supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture ||
      "",
  };
  return (
    <MenuProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar user={user} />
        <SidebarInset>
          <SiteHeader className="hidden md:flex" />
          {children}
        </SidebarInset>
        <BottomNav className="md:hidden" />
      </SidebarProvider>
    </MenuProvider>
  );
}
