"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
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
    UserPlus
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { useLanguage } from "@/contexts/language-context";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
    href: string;
    labelKey: string;
    icon: React.ElementType;
    external?: boolean;
    superadminOnly?: boolean;
    allowedRoles?: string[];
}

interface NavGroup {
    id: string;
    labelKey: string;
    items: NavItem[];
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
            { href: "/dashboard/users", labelKey: "nav.users", icon: Users, superadminOnly: true },
            { href: "/dashboard/settings", labelKey: "nav.settings", icon: Settings },
            { href: "/dashboard/system-monitor", labelKey: "nav.systemMonitor", icon: Activity, superadminOnly: true },
            { href: "/dashboard/notifications", labelKey: "nav.notifications", icon: Bell, superadminOnly: true },
        ],
    },
];

export function SidebarNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { isCollapsed, toggleCollapse } = useSidebar();
    const { t } = useLanguage();
    // @ts-ignore
    const userRole = session?.user?.role;

    // Track collapsed groups — all expanded by default
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (id: string) => {
        setCollapsedGroups(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <TooltipProvider delayDuration={0}>
            <nav className="flex-1 px-2 py-2 overflow-y-auto overflow-x-hidden space-y-0.5 styled-scrollbar">
                {navGroups.map((group) => {
                    const visibleItems = group.items.filter((item) => {
                        if (item.superadminOnly && userRole !== "SUPERADMIN") return false;
                        if (item.allowedRoles && (!userRole || !item.allowedRoles.includes(userRole))) return false;
                        return true;
                    });
                    if (visibleItems.length === 0) return null;

                    const isGroupCollapsed = collapsedGroups[group.id] ?? false;
                    const groupLabel = t(group.labelKey);

                    // "Main" group doesn't show a collapsible header
                    if (group.id === "main") {
                        return (
                            <div key={group.id} className="mb-1">
                                {visibleItems.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        item={item}
                                        label={t(item.labelKey)}
                                        active={isActive(item.href)}
                                        isCollapsed={isCollapsed}
                                    />
                                ))}
                            </div>
                        );
                    }

                    return (
                        <div key={group.id} className="mb-1">
                            {/* Group header — hidden when sidebar collapsed */}
                            {!isCollapsed && (
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground/80 transition-colors group"
                                >
                                    {groupLabel}
                                    <ChevronDown
                                        size={12}
                                        className={`transition-transform duration-200 ${isGroupCollapsed ? "-rotate-90" : ""}`}
                                    />
                                </button>
                            )}

                            {/* Collapsed sidebar: show a thin divider between groups */}
                            {isCollapsed && (
                                <div className="mx-3 my-2 border-t border-border/30" />
                            )}

                            {(!isGroupCollapsed || isCollapsed) && (
                                <div className="space-y-0.5">
                                    {visibleItems.map((item) => (
                                        <NavLink
                                            key={item.href}
                                            item={item}
                                            label={t(item.labelKey)}
                                            active={isActive(item.href)}
                                            isCollapsed={isCollapsed}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Collapse Toggle Button */}
            <div className="px-2 py-2 border-t border-border/30">
                <button
                    onClick={toggleCollapse}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                    {isCollapsed ? (
                        <PanelLeft size={18} />
                    ) : (
                        <>
                            <PanelLeftClose size={16} />
                            <span>{t("nav.collapse")}</span>
                        </>
                    )}
                </button>
            </div>
        </TooltipProvider>
    );
}

function NavLink({
    item,
    label,
    active,
    isCollapsed,
}: {
    item: NavItem;
    label: string;
    active: boolean;
    isCollapsed: boolean;
}) {
    const Icon = item.icon;

    const linkContent = (
        <Link
            href={item.href}
            target={item.external ? "_blank" : undefined}
            className={`
                flex items-center rounded-lg text-sm font-medium
                transition-all duration-200 group relative
                ${isCollapsed ? "justify-center px-2 py-2.5 mx-1" : "gap-3 px-3 py-2"}
                ${active
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }
            `}
        >
            {active && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
            )}
            <Icon
                size={isCollapsed ? 20 : 17}
                className={`flex-shrink-0 transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"}`}
            />
            {!isCollapsed && <span className="truncate">{label}</span>}
        </Link>
    );

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                    <p className="text-xs font-medium">{label}</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return linkContent;
}
