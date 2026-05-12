import { TopBar } from "@/components/layout/top-bar";

export default function DashboardPage() {
  return (
    <>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border p-4 shrink-0">
          <h2 className="text-sm font-semibold text-muted-foreground">Sidebar</h2>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-sm font-semibold text-muted-foreground">Main</h2>
        </main>
      </div>
    </>
  );
}
