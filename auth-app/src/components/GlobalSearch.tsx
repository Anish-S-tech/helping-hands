"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Loader2, Users, FolderKanban, MessageSquare, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MOCK_PROJECTS, MOCK_BUILDERS, MOCK_FOUNDERS } from "@/data/mock-data"

interface SearchResult {
    type: "project" | "person" | "message"
    id: string
    title: string
    subtitle?: string
    href: string
    icon?: React.ReactNode
}

export function GlobalSearch() {
    const router = useRouter()
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const searchRef = React.useRef<HTMLDivElement>(null)

    // Debounced search
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([])
            setIsOpen(false)
            return
        }

        setIsLoading(true)
        const timer = setTimeout(() => {
            const searchResults: SearchResult[] = []

            // Search projects
            const projects = MOCK_PROJECTS.filter(p =>
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.sector.toLowerCase().includes(query.toLowerCase()) ||
                p.vision.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 4)

            projects.forEach(p => {
                searchResults.push({
                    type: "project",
                    id: p.id,
                    title: p.title,
                    subtitle: p.sector,
                    href: `/projects/${p.id}`,
                    icon: <FolderKanban className="h-4 w-4 text-primary" />
                })
            })

            // Search people
            const people = [...MOCK_BUILDERS, ...MOCK_FOUNDERS].filter(p =>
                p.full_name.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3)

            people.forEach(p => {
                searchResults.push({
                    type: "person",
                    id: p.id,
                    title: p.full_name,
                    subtitle: p.role_type === 'builder' ? p.specialization : 'Founder',
                    href: `/profile/${p.id}`,
                    icon: <Users className="h-4 w-4 text-blue-500" />
                })
            })

            setResults(searchResults)
            setIsOpen(searchResults.length > 0)
            setIsLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Click outside to close
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleResultClick = (href: string) => {
        setQuery("")
        setIsOpen(false)
        router.push(href)
    }

    const groupedResults = React.useMemo(() => {
        const grouped: Record<string, SearchResult[]> = {
            projects: [],
            people: [],
            messages: []
        }

        results.forEach(result => {
            if (result.type === "project") grouped.projects.push(result)
            else if (result.type === "person") grouped.people.push(result)
            else if (result.type === "message") grouped.messages.push(result)
        })

        return grouped
    }, [results])

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search projects, people..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    className="pl-10 pr-10 h-10 bg-muted/30 border-border/50"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border/50 rounded-lg shadow-elevated max-h-96 overflow-y-auto z-50">
                    {results.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No results found
                        </div>
                    ) : (
                        <div className="p-2">
                            {/* Projects */}
                            {groupedResults.projects.length > 0 && (
                                <div className="mb-2">
                                    <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                        Projects
                                    </p>
                                    {groupedResults.projects.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleResultClick(result.href)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                                        >
                                            {result.icon}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{result.title}</p>
                                                {result.subtitle && (
                                                    <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* People */}
                            {groupedResults.people.length > 0 && (
                                <div>
                                    <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                        People
                                    </p>
                                    {groupedResults.people.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleResultClick(result.href)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                                        >
                                            {result.icon}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{result.title}</p>
                                                {result.subtitle && (
                                                    <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
