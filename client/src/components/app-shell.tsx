import AppSidebar from "@/components/app-sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ display: "flex" }}>
      <AppSidebar />
      <main
        className="flex-1 min-h-screen overflow-x-hidden transition-all duration-300 sidebar-margin"
      >
        {children}
      </main>
    </div>
  );
}
