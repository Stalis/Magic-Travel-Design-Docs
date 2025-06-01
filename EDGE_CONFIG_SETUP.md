# Настройка Vercel Edge Config для аутентификации

## Шаг 1: Создание Edge Config

1. Зайдите в [панель управления Vercel](https://vercel.com/dashboard)
2. Перейдите в раздел "Storage" -> "Edge Config"
3. Нажмите "Create Edge Config"
4. Дайте имя вашему конфигу (например, "auth-config")

## Шаг 2: Добавление пользователей

В Edge Config добавьте ключ `users` со значением в формате JSON:

```json
{
  "admin": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
  "user": "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270"
}
```

### Генерация хешей паролей

Для генерации SHA-256 хеша пароля используйте Node.js:

```javascript
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Примеры:
console.log('admin123:', hashPassword('admin123'));
console.log('userpass:', hashPassword('userpass'));
```

Или используйте онлайн-генератор SHA-256.

## Шаг 3: Подключение к проекту

1. В настройках проекта Vercel перейдите в "Environment Variables"
2. Добавьте переменную `EDGE_CONFIG` со значением connection string вашего Edge Config
3. Connection string можно найти в настройках Edge Config в панели Vercel

## Шаг 4: Настройка локальной разработки

Создайте файл `.env.local`:

```bash
EDGE_CONFIG=your_edge_config_connection_string
NODE_ENV=development
```

## Структура данных в Edge Config

```json
{
  "users": {
    "username1": "sha256_hash_of_password1",
    "username2": "sha256_hash_of_password2"
  }
}
```

## Безопасность

- ✅ Пароли хранятся в виде SHA-256 хешей
- ✅ Используется HTTP Basic Auth с автоматическими cookie сессиями
- ✅ Сессии имеют ограниченное время жизни (24 часа)
- ✅ Cookie устанавливаются с флагами HttpOnly и Secure
- ✅ Поддержка HTTPS в продакшене

## Тестирование

После настройки Edge Config и деплоя на Vercel, доступ к защищенным путям (`/docs`, `/admin`) будет требовать аутентификации.

Пример тестирования с curl:

```bash
# Запрос без аутентификации (должен вернуть 401)
curl -i https://your-domain.vercel.app/docs

# Запрос с аутентификацией
curl -i -u admin:admin123 https://your-domain.vercel.app/docs
```
