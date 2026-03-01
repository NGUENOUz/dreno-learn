import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 🚨 1. GILET PARE-BALLES (AJOUT CRUCIAL)
  // On laisse passer TOUTES les routes API immédiatement, sans toucher aux cookies ni à Supabase.
  // C'est ça qui va sauver votre Webhook Chariow.
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. VÉRIFICATION DE SÉCURITÉ
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 3. PROTECTION DES ROUTES PRIVÉES
  const isProtectedRoute = 
    url.pathname.startsWith('/dashboard') || 
    url.pathname.startsWith('/my-courses') || 
    url.pathname.startsWith('/favorites')

  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 4. REDIRECTION SI DÉJÀ CONNECTÉ
  const isAuthPage = url.pathname === '/login' || url.pathname === '/register'
  if (user && isAuthPage) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

// 5. CONFIGURATION DU MATCHER
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - api (API routes) -> On le garde ici aussi par sécurité
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|api).*)',
  ],
}