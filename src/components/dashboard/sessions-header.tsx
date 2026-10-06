"use client";

import { useLanguage } from "@/contexts/language-context";

export function SessionsHeader() {
    const { t } = useLanguage();
    return (
        <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {t("sessions.manageSessions")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
                {t("sessions.subtitle")}
            </p>
        </div>
    );
}
