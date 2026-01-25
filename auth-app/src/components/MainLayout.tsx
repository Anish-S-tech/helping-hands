"use client"

import * as React from "react"
import { PrimaryTopNav } from "@/components/PrimaryTopNav"
import { SecondaryTopNav } from "@/components/SecondaryTopNav"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Primary Navigation */}
            <PrimaryTopNav />

            {/* Secondary Navigation */}
            <SecondaryTopNav />

            {/* Main Content */}
            <main className="flex-1 pt-6 pb-12">
                <div className="container px-4 md:px-6">
                    {children}
                </div>
            </main>

            {/* Background Effects */}
            <div className="dashboard-bg-effect" />
        </div>
    )
}
