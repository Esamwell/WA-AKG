"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    QrCode,
    ImageIcon,
    Webhook,
    CalendarClock,
    Bot,
    Bell,
    FileText,
    Code,
    UserCheck,
    Megaphone,
    HardDrive,
    Activity,
    UserCircle,
    Tag,
    MessageCircleReply,
    UserPlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/language-context";
import pkg from "../../../package.json";

interface NavGroup {
    id: string;
    labelKey: string;
    items: { href: string; labelKey: string; icon: React.ElementType; external?: boolean; superadminOnly?: boolean }[];
}

const navGroups: NavGroup[] = [
    {
        id: "main",
        labelKey: "nav.main",
        items: [
            { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
            { href: "/dashboard/sessions", labelKey: "nav.sessions", icon: QrCode },
        ],
    },
    {
        id: "messaging",
        labelKey: "nav.messaging",
        items: [
            { href: "/dashboard/chat", labelKey: "nav.chat", icon: MessageSquare },
            { href: "/dashboard/broadcast", labelKey: "nav.broadcast", icon: Megaphone },
            { href: "/dashboard/sticker", labelKey: "nav.sticker", icon: ImageIcon },
        ],
    },
    {
        id: "contacts",
        labelKey: "nav.contacts",
        items: [
            { href: "/dashboard/contacts", labelKey: "nav.contactsList", icon: UserCheck },
            { href: "/dashboard/groups", labelKey: "nav.groups", icon: Users },
            { href: "/dashboard/labels", labelKey: "nav.labels", icon: Tag },
        ],
    },
    {
        id: "automation",
        labelKey: "nav.automation",
        items: [
            { href: "/dashboard/bot-settings", labelKey: "nav.botSettings", icon: Bot },
            { href: "/dashboard/autoreply", labelKey: "nav.autoReply", icon: MessageCircleReply },
            { href: "/dashboard/profile", labelKey: "nav.botProfile", icon: UserCircle },
            { href: "/dashboard/scheduler", labelKey: "nav.scheduler", icon: CalendarClock },
            { href: "/dashboard/webhooks", labelKey: "nav.webhooks", icon: Webhook },
        ],
    },
    {
        id: "developer",
        labelKey: "nav.developer",
        items: [
            { href: "/docs", labelKey: "nav.apiDocs", icon: FileText },
            { href: "/swagger", labelKey: "nav.swagger", icon: Code, external: true },
        ],
    },
    {
        id: "administration",
        labelKey: "nav.administration",
        items: [
            { href: "/dashboard/media", labelKey: "nav.media", icon: HardDrive },
            { href: "/dashboard/sessions/access", labelKey: "nav.sessionAccess", icon: UserPlus },
            { href: "/dashboard/users", labelKey: "nav.users", icon: Users },
            { href: "/dashboard/settings", labelKey: "nav.settings", icon: Settings },
            { href: "/dashboard/system-monitor", labelKey: "nav.systemMonitor", icon: Activity, superadminOnly: true },
            { href: "/dashboard/notifications", labelKey: "nav.notifications", icon: Bell, superadminOnly: true },
        ],
    },
];

export function MobileNav({ appName = "WA-AKG" }: { appName?: string }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();
    const { t } = useLanguage();
    // @ts-ignore
    const userRole = session?.user?.role;

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[320px] p-0 flex flex-col">
                <SheetHeader className="px-5 py-4 text-left border-b border-slate-100">
                    <SheetTitle className="text-xl font-bold text-slate-800">{appName}</SheetTitle>
                    <SheetDescription className="text-[11px] text-slate-400 -mt-1">{t("nav.gatewaySubtitle")}</SheetDescription>
                </SheetHeader>

                <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
                    {navGroups.map((group) => {
                        const visibleItems = group.items.filter(
                            (item) => !item.superadminOnly || userRole === "SUPERADMIN"
                        );
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.id} className="mb-1">
                                {group.id !== "main" && (
                                    <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                        {t(group.labelKey)}
                                    </p>
                                )}
                                <div className="space-y-0.5">
                                    {visibleItems.map(({ href, labelKey, icon: Icon, external }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            target={external ? "_blank" : undefined}
                                            onClick={() => setOpen(false)}
                                            className={`
                                                flex items-center rounded-lg text-sm font-medium
                                                transition-all duration-200 group relative
                                                gap-3 px-3 py-2
                                                ${isActive(href)
                                                    ? "text-primary bg-primary/10 shadow-sm"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                }
                                            `}
                                        >
                                            {isActive(href) && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                                            )}
                                            <Icon
                                                size={17}
                                                className={`flex-shrink-0 transition-colors duration-200 ${isActive(href) ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"}`}
                                            />
                                            <span className="truncate">{t(labelKey)}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{session?.user?.name || "User"}</p>
                            <p className="text-[11px] text-slate-400 truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2 text-xs h-8"
                        onClick={async () => {
                            setOpen(false);
                            await signOut({ callbackUrl: "/auth/login" });
                        }}
                    >
                        <LogOut size={14} /> {t("nav.signOut")}
                    </Button>
                    <p className="text-[10px] text-slate-300 text-center mt-2 font-mono">v{pkg.version}</p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
