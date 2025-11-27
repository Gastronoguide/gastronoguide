"use client";

import React from "react";
import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { languageNames, type Language } from "../lib/translations";
import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg shadow-sm p-1.5 sm:p-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
        <SelectTrigger className="h-8 sm:h-9 w-[60px] sm:w-[140px] border-0 shadow-none focus:ring-0 text-sm sm:text-base">
          <SelectValue>
            <span className="sm:hidden">{language.toUpperCase()}</span>
            <span className="hidden sm:inline">{languageNames[language]}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(languageNames) as Language[]).map((lang) => (
            <SelectItem key={lang} value={lang} className="text-sm sm:text-base">
              <span className="sm:hidden">{lang.toUpperCase()}</span>
              <span className="hidden sm:inline">{languageNames[lang]}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
