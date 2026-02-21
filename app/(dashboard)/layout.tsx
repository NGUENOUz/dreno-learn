"use client";
import { Sidebar } from "@/components/SiteBar"; 
import {  ShoppingCart, LayoutDashboard, BookOpen, GraduationCap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion} from "framer-motion";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/courses", icon: BookOpen, label: "Cours" },
  { href: "/my-courses", icon: GraduationCap, label: "Mes cours" },
  { href: "/favorites", icon: Heart, label: "Favoris" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-pattern-afro">
      <div className="hidden lg:flex"><Sidebar /></div>
      
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="h-16 md:h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
           
           {/* LOGO MOBILE VS BIENVENUE DESKTOP */}
           <div className="flex items-center gap-3">
              <Link href="/" className="flex lg:hidden items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                   <span className="text-white font-black text-lg">D</span>
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter">Dreno<span className="text-blue-600">learn</span></span>
              </Link>

              {/* RESTAURATION DU MESSAGE DE BIENVENUE SUR DESKTOP */}
              <div className="hidden lg:block">
                <h2 className="text-xl font-black text-slate-900 leading-none">Bienvenue sur Dreno learn</h2>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">Explore nos meilleures formations</p>
              </div>
           </div>

           <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2 text-slate-600 relative hover:text-blue-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">0</span>
              </button>
              
              <div className="pl-2 sm:pl-4 border-l border-slate-100 ml-1">
                <Button asChild className="h-9 sm:h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 text-xs sm:text-sm">
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              </div>
           </div>
        </header>

        <main className="p-4 md:p-8 grow">{children}</main>

        {/* BOTTOM NAV SNAKE ANIMÉE */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white border border-slate-200/50 h-16 rounded-4xl flex items-center justify-around px-2 z-50 shadow-2xl">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center w-14 h-full">
                  {isActive && (
                    <motion.div 
                      layoutId="snake-nav"
                      className="absolute -top-1 w-10 h-1 bg-blue-600 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-blue-600 scale-110" : "text-slate-400"}`} />
                  <span className={`text-[10px] font-black mt-0.5 ${isActive ? "text-blue-600" : "text-slate-400"}`}>{item.label}</span>
                </Link>
              );
            })}
        </nav>
      </div>
    </div>
  );
}