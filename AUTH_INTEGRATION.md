# Интеграция HTTP-аутентификации с VitePress

Этот проект включает middleware для HTTP-аутентификации, который работает на Vercel Edge Runtime и может быть интегрирован с VitePress.

## Файлы аутентификации

- `api/auth-proxy.ts` - Основная логика аутентификации
- `middleware.ts` - Vercel middleware в корне проекта
- `.env.example` - Пример переменных окружения

## Настройка

1. **Скопируйте файл переменных окружения:**
   ```bash
   cp .env.example .env.local
   ```

2. **Установите пароли в `.env.local`:**
   ```env
   ADMIN_PASSWORD=your_secure_admin_password
   USER_PASSWORD=your_secure_user_password
   NODE_ENV=production
   ```

3. **Настройте защищенные пути** в `api/auth-proxy.ts`:
   ```typescript
   protectedPaths: ['/docs', '/admin'], // Добавьте нужные пути
   ```

## Как это работает

### Механизм аутентификации
- Использует HTTP Basic Authentication
- Сохраняет сессии в защищенных cookies
- Автоматически проверяет доступ к защищенным путям

### Пользователи по умолчанию
- **admin** - полный доступ
- **user** - ограниченный доступ

### Сессии
- Время жизни: 24 часа
- Автоматическое продление при активности
- Безопасные HTTP-only cookies

## Интеграция с VitePress

### Для локальной разработки
VitePress будет работать как обычно в dev режиме. Middleware активируется только при деплое на Vercel.

### Для production на Vercel
1. Убедитесь, что файл `middleware.ts` находится в корне проекта
2. Настройте переменные окружения в панели Vercel
3. Задеплойте проект

### Настройка защищенных разделов
В файле `api/auth-proxy.ts` измените массив `protectedPaths`:

```typescript
protectedPaths: [
  '/docs',        // Защитить всю документацию
  '/admin',       // Админ панель
  '/private',     // Приватный раздел
],
```

## Использование

### Доступ к защищенному контенту
1. Перейдите на защищенный URL
2. Браузер запросит логин и пароль
3. Введите учетные данные (admin/password или user/password)
4. После успешной аутентификации вы получите доступ

### Выход из системы
Для выхода удалите cookie `auth-session` или дождитесь истечения сессии (24 часа).

## Безопасность

### Рекомендации для production:
1. **Обязательно измените пароли** в переменных окружения
2. Используйте сложные пароли (минимум 12 символов)
3. Регулярно обновляйте пароли
4. Рассмотрите использование более продвинутой системы аутентификации для критичных приложений

### Что защищено:
- HTTP-only cookies предотвращают XSS атаки
- Secure cookies в production (только HTTPS)
- SameSite защита от CSRF
- Базовая проверка времени жизни сессии

## Кастомизация

### Добавление новых пользователей
Измените объект `users` в `AUTH_CONFIG`:

```typescript
users: {
  'admin': process.env.ADMIN_PASSWORD || 'default_admin_pass',
  'user': process.env.USER_PASSWORD || 'default_user_pass',
  'editor': process.env.EDITOR_PASSWORD || 'default_editor_pass',
} as Record<string, string>,
```

### Изменение времени сессии
Измените `sessionDuration` в `AUTH_CONFIG`:

```typescript
// 1 час = 60 * 60 * 1000
// 1 день = 24 * 60 * 60 * 1000
sessionDuration: 12 * 60 * 60 * 1000, // 12 часов
```

### Кастомные заголовки аутентификации
Можно изменить realm в функции `createAuthResponse()`:

```typescript
'WWW-Authenticate': 'Basic realm="My Custom Docs"',
```

## Отладка

Для отладки аутентификации можно добавить логирование:

```typescript
console.log('Auth attempt:', {
  path: pathname,
  hasSession: !!sessionCookie,
  hasAuth: !!authHeader,
});
```

## Совместимость

- ✅ Vercel Edge Runtime
- ✅ VitePress статические сайты
- ✅ Современные браузеры
- ✅ Mobile браузеры
- ⚠️ Требует JavaScript для полной функциональности
