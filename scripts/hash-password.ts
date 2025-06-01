#!/usr/bin/env node

/**
 * Скрипт для генерации SHA-256 хешей паролей
 * Использование: node scripts/hash-password.js [password]
 */

import { createHash } from 'crypto';

// Функция для создания SHA-256 хеша
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

// function hashPassword(password) {
//   return createHash('sha256').update(password).digest('hex');
// }

// Получаем пароль из аргументов командной строки
const password = process.argv[2];

if (!password) {
  console.log('Использование: node scripts/hash-password.js [password]');
  console.log('');
  console.log('Примеры:');
  console.log('  node scripts/hash-password.js admin123');
  console.log('  node scripts/hash-password.js userpass');
  process.exit(1);
}

const hash = await sha256(password);

console.log('Пароль:', password);
console.log('SHA-256 хеш:', hash);
console.log('');
console.log('Добавьте в Edge Config:');
console.log(`"username": "${hash}"`);
