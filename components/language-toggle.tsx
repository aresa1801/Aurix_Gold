"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const languages = [
  {
    code: "en" as const,
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "id" as const,
    name: "Bahasa Indonesia",
    flag: "🇮🇩",
  },
]

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-gold/20 text-soft-white hover:bg-gold/10 bg-transparent">
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          <span className="hidden md:inline ml-1">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-navy-800 border-gold/20">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="cursor-pointer hover:bg-gold/10"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span className="text-soft-white">{lang.name}</span>
              </div>
              {language === lang.code && <Check className="h-4 w-4 text-gold" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
