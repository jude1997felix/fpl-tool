import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard',  icon: '▣' },
  { href: '/optimizer', label: 'Optimizer',  icon: '◎' },
  { href: '/transfers', label: 'Transfers',  icon: '⇄' },
  { href: '/leagues',   label: 'Leagues',    icon: '◈' },
  { href: '/analysis',  label: 'Analysis',   icon: '∿' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-background grid-bg flex text-foreground">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col shrink-0 border-r border-border/60 bg-sidebar/80 backdrop-blur-xl">

        {/* Logo */}
        <div className="px-5 py-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center glow-cyan">
              <span className="text-primary text-sm font-bold">⚽</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-foreground">FPL Tool</div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">2025 / 26</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">Menu</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-150 text-sm font-medium"
            >
              <span className="text-base w-5 text-center group-hover:text-primary transition-colors">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border/40">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-[10px]">✦</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-foreground truncate font-medium">{user.email?.split('@')[0]}</div>
              <div className="text-[10px] text-muted-foreground">Manager</div>
            </div>
          </div>
          <form action="/auth/signout" method="post" className="mt-1">
            <button className="w-full text-left px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/4">
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
