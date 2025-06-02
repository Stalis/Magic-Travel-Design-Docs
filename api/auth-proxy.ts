import { get } from '@vercel/edge-config';

// Конфигурация аутентификации
const AUTH_CONFIG = {
  // Название cookie для сессии
  sessionCookieName: 'auth-session',
  // Время жизни сессии (24 часа)
  sessionDuration: 24 * 60 * 60 * 1000,
  // Ключ для получения пользователей из Edge Config
  edgeConfigKey: 'users',
  // Защита от брутфорса
  bruteForce: {
    // Базовая задержка при неудачной попытке (в миллисекундах)
    baseDelay: 1000,
    // Максимальная задержка
    maxDelay: 5000,
  },
};

// Интерфейс для сессии
interface Session {
  username: string;
  loginTime: number;
  expiresAt: number;
}

async function sha256(message: string): Promise<string> {
  // Конвертируем строку в ArrayBuffer
  const msgBuffer = new TextEncoder().encode(message)
  
  // Хешируем с помощью Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  
  // Конвертируем в hex строку
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

/**
 * Создает задержку для замедления брутфорс атак
 */
async function createBruteForceDelay(): Promise<void> {
  // Случайная задержка от 1 до 5 секунд
  const delay = Math.random() * (AUTH_CONFIG.bruteForce.maxDelay - AUTH_CONFIG.bruteForce.baseDelay) + AUTH_CONFIG.bruteForce.baseDelay;
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Кодирует данные сессии в Base64
 */
function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

/**
 * Декодирует данные сессии из Base64
 */
function decodeSession(encoded: string): Session | null {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Извлекает данные Basic Auth из заголовка Authorization
 */
function parseBasicAuth(authHeader: string): { username: string; password: string } | null {
  const match = authHeader.match(/^Basic\s+(.+)$/);
  if (!match) return null;

  try {
    const credentials = Buffer.from(match[1], 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    return { username, password };
  } catch {
    return null;
  }
}

/**
 * Проверяет валидность учетных данных через Edge Config
 */
async function validateCredentials(username: string, password: string): Promise<boolean> {
  try {
    // Получаем пользователей из Edge Config
    const users = await get(AUTH_CONFIG.edgeConfigKey) as Record<string, string> | null;
    
    if (!users || !users[username]) {
      return false;
    }
    
    // Сравниваем хеш введенного пароля с сохраненным хешем
    const passwordHash = await sha256(password);
    return users[username] === passwordHash;
  } catch (error) {
    console.error('Error validating credentials:', error);
    return false;
  }
}

/**
 * Создает новую сессию
 */
function createSession(username: string): Session {
  const now = Date.now();
  return {
    username,
    loginTime: now,
    expiresAt: now + AUTH_CONFIG.sessionDuration,
  };
}

/**
 * Проверяет валидность сессии
 */
function isValidSession(session: Session): boolean {
  return session.expiresAt > Date.now();
}

/**
 * Извлекает cookie из заголовка Cookie
 */
function getCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[name];
}

/**
 * Создает ответ с требованием аутентификации
 */
function createAuthResponse(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected Area"',
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Создает cookie строку для установки в заголовок Set-Cookie
 */
function createCookieString(name: string, value: string, options: {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
  maxAge?: number;
  path?: string;
}): string {
  let cookie = `${name}=${value}`;
  
  if (options.httpOnly) cookie += '; HttpOnly';
  if (options.secure) cookie += '; Secure';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options.path) cookie += `; Path=${options.path}`;
  
  return cookie;
}

/**
 * Основная middleware функция для Vercel Edge Runtime
 */
export default async function middleware(request: Request): Promise<Response | undefined> {
  // Проверяем существующую сессию
  const sessionCookie = getCookie(request, AUTH_CONFIG.sessionCookieName);
  if (sessionCookie) {
    const session = decodeSession(sessionCookie);
    if (session && isValidSession(session)) {
      // Сессия валидна, продолжаем
      return undefined;
    }
  }

  // Проверяем Basic Auth
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const credentials = parseBasicAuth(authHeader);
    if (credentials) {
      const isValid = await validateCredentials(credentials.username, credentials.password);
      
      if (isValid) {
        // Создаем новую сессию
        const session = createSession(credentials.username);
        
        // Создаем заголовки для установки cookie и продолжения запроса
        const headers = new Headers();
        headers.set('Set-Cookie', createCookieString(
          AUTH_CONFIG.sessionCookieName,
          encodeSession(session),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: AUTH_CONFIG.sessionDuration / 1000,
            path: '/',
          }
        ));

        // Создаем новый запрос с установленными заголовками и продолжаем
        const modifiedRequest = new Request(request, { headers });
        
        // Возвращаем undefined чтобы позволить запросу продолжиться
        // Cookie будет установлен через заголовки ответа
        return new Response(null, {
          status: 200,
          headers,
        });
      } else {
        // Неверные учетные данные - добавляем задержку
        await createBruteForceDelay();
      }
    }
  }

  // Аутентификация не пройдена
  return createAuthResponse();
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
     * - favicon.ico, robots.txt и другие служебные файлы
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};