"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Languages, Check } from "lucide-react";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "icon" : "sm"}
          className={`h-9 rounded-lg border-border/60 hover:bg-muted/50 text-xs font-medium gap-1.5 transition-colors ${
            compact ? "w-9 px-0" : "px-2.5"
          }`}
          title={t("common.language")}
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          {!compact && (
            <span className="font-semibold text-foreground">
              {language === "pt-BR" ? "PT" : "EN"}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-40 p-1.5 rounded-xl border border-border/50 shadow-xl bg-popover/95 backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => {
            setLanguage("pt-BR");
            setOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left font-medium ${
            language === "pt-BR"
              ? "bg-primary/10 text-primary font-semibold"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>🇧🇷</span> Português
          </span>
          {language === "pt-BR" && <Check className="h-3.5 w-3.5 text-primary" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setLanguage("en-US");
            setOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left font-medium mt-0.5 ${
            language === "en-US"
              ? "bg-primary/10 text-primary font-semibold"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>🇺🇸</span> English
          </span>
          {language === "en-US" && <Check className="h-3.5 w-3.5 text-primary" />}
        </button>
      </PopoverContent>
    </Popover>
  );
}
