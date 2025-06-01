import authMiddleware from './api/auth-proxy';

/**
 * Vercel Edge Runtime middleware
 * Этот файл должен находиться в корне проекта
 */
export default async function middleware(request: Request): Promise<Response | undefined> {
  return await authMiddleware(request);
}

/**
 * Конфигурация matcher для определения, какие пути обрабатывать
 */
export const config = {
  matcher: [
    /*
     * Обрабатываем все пути кроме:
     * - api routes
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico
     * - статические ресурсы VitePress
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|vite|@vite).*)',
  ],
};
