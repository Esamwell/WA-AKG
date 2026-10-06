"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Save, AlertCircle, Languages } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-context";
import { Language } from "@/locales";

export default function SettingsPage() {
    const { data: authSession } = useSession();
    const { t, setLanguage: setClientLanguage } = useLanguage();
    const isSuperAdmin = (authSession?.user as any)?.role === "SUPERADMIN";

    const [systemConfig, setSystemConfig] = useState<{
        appName: string;
        logoUrl: string;
        faviconUrl: string;
        timezone: string;
        enableRegistration: boolean;
        language: Language;
    }>({
        appName: "WA-AKG",
        logoUrl: "",
        faviconUrl: "/favicon.ico",
        timezone: "America/Sao_Paulo",
        enableRegistration: true,
        language: "pt-BR"
    });
    const [systemLoading, setSystemLoading] = useState(false);
    const [timezones, setTimezones] = useState<string[]>(["UTC", "America/Sao_Paulo", "America/New_York", "Asia/Jakarta"]);

    useEffect(() => {
        try {
            if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
                const list = Intl.supportedValuesOf("timeZone");
                if (!list.includes("UTC")) {
                    list.push("UTC");
                }
                list.sort();
                setTimezones(list);
            }
        } catch (e) {
            console.error("Failed to load timezones dynamically", e);
        }
    }, []);

    useEffect(() => {
        fetch('/api/settings/system')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(responseData => {
                const data = responseData?.data;
                if (data && !responseData.error) {
                    setSystemConfig({
                        appName: data.appName || "WA-AKG",
                        logoUrl: data.logoUrl || "",
                        faviconUrl: data.faviconUrl || "/favicon.ico",
                        timezone: data.timezone || "America/Sao_Paulo",
                        enableRegistration: data.enableRegistration !== undefined ? data.enableRegistration : true,
                        language: (data.language as Language) || "pt-BR"
                    });
                }
            })
            .catch(() => { });
    }, []);

    const handleLanguageChange = (newLang: Language) => {
        setSystemConfig(prev => ({ ...prev, language: newLang }));
        setClientLanguage(newLang);
    };

    const handleSaveSystem = async () => {
        setSystemLoading(true);
        try {
            const res = await fetch('/api/settings/system', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(systemConfig)
            });

            if (res.ok) {
                setClientLanguage(systemConfig.language);
                toast.success(t("settings.updateSuccess"));
            } else {
                toast.error(t("settings.updateError"));
            }
        } catch (e) {
            console.error(e);
            toast.error(t("settings.updateError"));
        } finally {
            setSystemLoading(false);
        }
    };

    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight">{t("settings.title")}</h2>
                <p className="text-muted-foreground text-sm mt-1">{t("settings.subtitle")}</p>
            </div>

            {!isSuperAdmin && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-900">{t("settings.viewOnlyTitle")}</p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    {t("settings.viewOnlyDesc")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* System Configuration (Global) */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-xl">{t("settings.appConfigTitle")}</CardTitle>
                    <CardDescription>{t("settings.appConfigDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("settings.appName")}</Label>
                            <input
                                className={inputClass}
                                placeholder="WA-AKG"
                                value={systemConfig.appName}
                                onChange={(e) => setSystemConfig(prev => ({ ...prev, appName: e.target.value }))}
                                disabled={!isSuperAdmin}
                            />
                            <p className="text-xs text-muted-foreground">{t("settings.appNameHelp")}</p>
                        </div>

                        {/* Language Selection */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-1.5">
                                <Languages className="h-4 w-4 text-primary" />
                                {t("settings.languageLabel")}
                            </Label>
                            <select
                                className={inputClass}
                                value={systemConfig.language}
                                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                                disabled={!isSuperAdmin}
                            >
                                <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                                <option value="en-US">🇺🇸 English (United States)</option>
                            </select>
                            <p className="text-xs text-muted-foreground">{t("settings.languageHelp")}</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("settings.timezone")}</Label>
                            <select
                                className={inputClass}
                                value={systemConfig.timezone}
                                onChange={(e) => setSystemConfig(prev => ({ ...prev, timezone: e.target.value }))}
                                disabled={!isSuperAdmin}
                            >
                                {timezones.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">{t("settings.timezoneHelp")}</p>
                        </div>

                        <div className="grid gap-2">
                            <Label>{t("settings.logoUrl")}</Label>
                            <input
                                className={inputClass}
                                placeholder="https://example.com/logo.png"
                                value={systemConfig.logoUrl}
                                onChange={(e) => setSystemConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                                disabled={!isSuperAdmin}
                            />
                            <p className="text-xs text-muted-foreground">{t("settings.logoUrlHelp")}</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{t("settings.faviconUrl")}</Label>
                            <input
                                className={inputClass}
                                placeholder="/favicon.ico"
                                value={systemConfig.faviconUrl || ""}
                                onChange={(e) => setSystemConfig(prev => ({ ...prev, faviconUrl: e.target.value }))}
                                disabled={!isSuperAdmin}
                            />
                            <p className="text-xs text-muted-foreground">{t("settings.faviconUrlHelp")}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 pt-2 border-t border-border/50">
                        <Label htmlFor="enable-registration" className="flex flex-col space-y-1">
                            <span>{t("settings.enableRegistration")}</span>
                            <span className="font-normal text-xs text-muted-foreground">
                                {t("settings.enableRegistrationHelp")}
                            </span>
                        </Label>
                        <Switch
                            id="enable-registration"
                            checked={systemConfig.enableRegistration}
                            onCheckedChange={c => setSystemConfig(prev => ({ ...prev, enableRegistration: c }))}
                            disabled={!isSuperAdmin}
                        />
                    </div>

                    <div className="pt-2">
                        <Button onClick={handleSaveSystem} disabled={systemLoading || !isSuperAdmin}>
                            {systemLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {systemLoading ? t("settings.savingConfig") : t("settings.saveConfig")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* System Updates */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("settings.systemUpdatesTitle")}</CardTitle>
                    <CardDescription>{t("settings.systemUpdatesDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                            setSystemLoading(true);
                            try {
                                const res = await fetch("/api/system/check-updates", { method: "POST" });
                                const data = await res.json();
                                if (data.status) {
                                    toast.success(data.message || "Check complete!");
                                } else {
                                    toast.error(data.message || "Failed to check updates");
                                }
                            } catch (e) {
                                toast.error("Error checking updates");
                            } finally {
                                setSystemLoading(false);
                            }
                        }}
                        disabled={systemLoading}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${systemLoading ? 'animate-spin' : ''}`} />
                        {systemLoading ? t("settings.checkingUpdates") : t("settings.checkUpdates")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
