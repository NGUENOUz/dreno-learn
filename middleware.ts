import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  // 1. VÉRIFICATION DE SÉCURITÉ : On utilise getUser() et non getSession()
  // Cela force une vérification réelle auprès de Supabase pour éviter les cookies fantômes.
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 2. PROTECTION DES ROUTES PRIVÉES
  const isProtectedRoute = 
    url.pathname.startsWith('/dashboard') || 
    url.pathname.startsWith('/my-courses') || 
    url.pathname.startsWith('/favorites')

  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. REDIRECTION SI DÉJÀ CONNECTÉ
  // Si l'utilisateur est connecté et essaie d'aller sur Login ou Register, on l'envoie au Dashboard.
  const isAuthPage = url.pathname === '/login' || url.pathname === '/register'
  if (user && isAuthPage) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

// 4. CONFIGURATION DU MATCHER
// On exclut les fichiers statiques, les images et l'api pour ne pas ralentir le site.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}