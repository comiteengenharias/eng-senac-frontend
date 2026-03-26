'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  LogOut,
  Headset,
  SquareMenu,
  ChevronDown,
  ExternalLink,
} from "lucide-react"
import { tooltipStudentItems, tooltipSupportItems, tooltipTeacherItems } from "./items"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { logout } from "@/services/api-login"
import LoadingOverlay from "../loading-overlay"
import type { LucideIcon } from "lucide-react"

interface SidebarItem {
  label: string
  icon: LucideIcon
  link: string
  id: string
  target?: string
}

export default function CustomSidebar({ pageId, type }: { pageId: string; type: string }) {
  const [open, setOpen] = useState(false)
  const [submenuAvaliacoesOpen, setSubmenuAvaliacoesOpen] = useState(false)



  const avaliacoesSubitems = [
    { label: "Banca", href: "/area-restrita/aluno/ver-avaliacoes/banca" },
    { label: "Feira", href: "/area-restrita/aluno/ver-avaliacoes/feira" },
  ]

  const tooltipItems: SidebarItem[] = type == 'student' ? tooltipStudentItems : type == 'teacher' ? tooltipTeacherItems : tooltipSupportItems

  const router = useRouter();

  const logoutFunc = () => {
    logout().then(() => {
      router.push('/');
    });
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-30 w-full h-16 px-4 border-b bg-white flex items-center justify-between sm:px-6">
        <Image unoptimized
          src="/img/branding/logo-blue.png"
          alt="Logo dos cursos de Engenharia do Senac Santo Amaro"
          width={120}
          height={0}
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <SquareMenu className="w-5 h-5" />
              <span className="sr-only">Abrir Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs py-12 px-6">
            <div className="h-full overflow-y-auto pr-1 flex flex-col justify-between">
              <nav className="flex flex-col gap-2 justify-between">
                {tooltipItems.map((item) => {
                  if (item.id === "ver-avaliacoes") {
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() =>
                            setSubmenuAvaliacoesOpen(!submenuAvaliacoesOpen)
                          }
                          className={`flex w-full justify-between items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ${pageId === item.id
                            ? "bg-[var(--blue)] text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${submenuAvaliacoesOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        {submenuAvaliacoesOpen && (
                          <div className="ml-6 mt-1 flex flex-col gap-1">
                            {avaliacoesSubitems.map((sub, i) => (
                              <Link
                                key={i}
                                href={sub.href}
                                onClick={() => setOpen(false)}
                                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.link}
                      target={item.target || '_self'}
                      onClick={() => setOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${pageId === item.id
                        ? "bg-[var(--blue)] text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.label}
                      {item.target === '_blank' && <ExternalLink className="w-3.5 h-3.5 ml-auto" />}
                    </Link>
                  )
                })}
              </nav>

              <nav className="mt-6">
                <div>
                  <Link
                    href="#"
                    className="flex items-center gap-2 px-3 py-2 text-red-700 hover:text-red-900"
                    onClick={logoutFunc}
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </Link>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Sidebar para desktop */}
      <aside className="hidden sm:flex fixed top-16 left-0 z-10 w-[250px] h-[calc(100vh-64px)] border-r bg-background flex-col justify-between">
        <TooltipProvider>
          <nav className="flex flex-col gap-2 px-4 py-5">
            {tooltipItems.map((item) => {
              if (item.id === "ver-avaliacoes") {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() =>
                        setSubmenuAvaliacoesOpen(!submenuAvaliacoesOpen)
                      }
                      className={`flex w-full justify-between items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ${pageId === item.id
                        ? "bg-[var(--blue)] text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${submenuAvaliacoesOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {submenuAvaliacoesOpen && (
                      <div className="ml-6 mt-1 flex flex-col gap-1">
                        {avaliacoesSubitems.map((sub, i) => (
                          <Link
                            key={i}
                            href={sub.href}
                            className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.id}
                  href={item.link}
                  target={item.target || '_self'}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${pageId === item.id
                    ? "bg-[var(--blue)] text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.label}
                  {item.target === '_blank' && <ExternalLink className="w-3.5 h-3.5 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-col gap-2 px-4 py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 text-red-700 hover:text-red-900"
                  onClick={logoutFunc}
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </Link>
              </TooltipTrigger>
              <TooltipContent>Sair</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </aside>
    </>
  )
}
