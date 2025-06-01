#!/usr/bin/env node

/**
 * Скрипт для генерации SHA-256 хешей паролей
 * Использование: node scripts/hash-password.js [password]
 */

import { createHash } from 'crypto';

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

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

const hash = hashPassword(password);

console.log('Пароль:', password);
console.log('SHA-256 хеш:', hash);
console.log('');
console.log('Добавьте в Edge Config:');
console.log(`"username": "${hash}"`);
