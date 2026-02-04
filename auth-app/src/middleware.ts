import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()

    // 1. Fix Legacy Redirects (The "Mistaken" paths causing 404s)
    if (url.pathname === '/builder/home') {
        url.pathname = '/dashboard/builder'
        return NextResponse.redirect(url)
    }
    if (url.pathname === '/founder/home') {
        url.pathname = '/dashboard/founder'
        return NextResponse.redirect(url)
    }

    // 2. Consolidate Login
    if (url.pathname === '/login') {
        url.pathname = '/auth'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/builder/home',
        '/founder/home',
        '/login',
    ],
}
