import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Utilisation de getUser() pour plus de sécurité contre la falsification de cookies
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // 1. PROTECTION : Rediriger vers /login si on tente d'accéder au privé sans session
  if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/my-courses'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. LOGIQUE CONNECTÉ : Rediriger vers /dashboard SEULEMENT si on est sur login/register
  // Cela permet d'accéder au catalogue (/courses) librement même connecté
  if (user && (url.pathname === '/login' || url.pathname === '/register')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}