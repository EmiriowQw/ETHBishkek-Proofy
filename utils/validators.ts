// Валидация для English Demo

import { COURSE_LEVELS } from '../constants/api';

/**
 * Валидация course ID
 */
export function isValidCourseId(courseId: unknown): courseId is string {
  if (typeof courseId !== 'string') return false;
  if (courseId.trim().length === 0) return false;
  if (courseId.length > 100) return false;
  // Проверка на допустимые символы (буквы, цифры, дефис)
  return /^[a-z0-9-]+$/i.test(courseId);
}

/**
 * Валидация Ethereum адреса кошелька
 */
export function isValidWalletAddress(address: unknown): address is string {
  if (typeof address !== 'string') return false;
  // Проверка формата Ethereum адреса (0x + 40 hex символов)
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Валидация уровня курса
 */
export function isValidCourseLevel(level: unknown): level is string {
  if (typeof level !== 'string') return false;
  const upperLevel = level.toUpperCase();
  // Проверка на точное совпадение или наличие в строке (для "B2-C1")
  return COURSE_LEVELS.some(validLevel => upperLevel.includes(validLevel));
}

/**
 * Валидация query параметра level
 */
export function isValidLevelFilter(level: unknown): level is string {
  if (typeof level !== 'string') return false;
  const upperLevel = level.toUpperCase();
  return COURSE_LEVELS.some(validLevel => validLevel === upperLevel);
}

/**
 * Санитизация строки (удаление опасных символов)
 */
export function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Удаление потенциально опасных символов
    .substring(0, 1000); // Ограничение длины
}

/**
 * Валидация объекта enrollment
 */
export function validateEnrollmentData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data) {
    errors.push('Enrollment data is required');
    return { isValid: false, errors };
  }

  if (!isValidCourseId(data.courseId)) {
    errors.push('Invalid course ID');
  }

  if (!isValidWalletAddress(data.studentAddress)) {
    errors.push('Invalid wallet address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

