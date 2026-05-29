import FounderSidebar from "../../../components/founder-sidebar"

import FounderNavbar from "../../../components/founder-navbar"

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen bg-[#0D1117] text-white">
      <FounderSidebar />

      <div className="flex-1 flex flex-col">
        <FounderNavbar />

        <section className="flex-1 p-8 overflow-y-auto">
          {children}
        </section>
      </div>
    </main>
  )
}