// Централизованная обработка ошибок

import { ERROR_MESSAGES } from '../constants/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Обработка ошибок API запросов
 */
export function handleApiError(error: unknown): string {
  // Логирование в development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // ApiError с кастомным сообщением
  if (error instanceof ApiError) {
    return error.message;
  }

  // Стандартная Error
  if (error instanceof Error) {
    // Сетевые ошибки
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message;
  }

  // Неизвестная ошибка
  return ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * Обработка ошибок с retry логикой
 */
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  retries: number = 2,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;
      
      // Не делать retry на последней попытке
      if (i < retries) {
        // Экспоненциальная задержка
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
}

/**
 * Безопасный парсинг JSON ответа
 */
export async function safeJsonParse<T>(response: Response): Promise<T> {
  try {
    const text = await response.text();
    if (!text) {
      throw new ApiError('Empty response from server', response.status);
    }
    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError('Invalid JSON response', response.status);
    }
    throw error;
  }
}

/**
 * Логирование ошибок (можно расширить для отправки в сервис мониторинга)
 */
export function logError(error: unknown, context?: string): void {
  const errorInfo = {
    message: error instanceof Error ? error.message : 'Unknown error',
    context,
    timestamp: new Date().toISOString(),
    ...(error instanceof ApiError && { statusCode: error.statusCode, details: error.details }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Error Log:', errorInfo);
  }

  // В production можно отправлять в Sentry, LogRocket и т.д.
  // sendToMonitoring(errorInfo);
}

