// Вспомогательные функции для курсов

/**
 * Получить цвет для уровня курса
 */
export function getLevelColor(level: string): string {
  const upperLevel = level.toUpperCase();
  
  if (upperLevel.includes('A1')) return 'bg-green-100 text-green-800';
  if (upperLevel.includes('A2')) return 'bg-blue-100 text-blue-800';
  if (upperLevel.includes('B1')) return 'bg-yellow-100 text-yellow-800';
  if (upperLevel.includes('B2')) return 'bg-orange-100 text-orange-800';
  if (upperLevel.includes('C1')) return 'bg-red-100 text-red-800';
  if (upperLevel.includes('C2')) return 'bg-purple-100 text-purple-800';
  
  return 'bg-gray-100 text-gray-800';
}

/**
 * Форматирование числа студентов
 */
export function formatStudentCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

/**
 * Форматирование рейтинга
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Получить описание уровня
 */
export function getLevelDescription(level: string): string {
  const descriptions: Record<string, string> = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Proficiency',
  };

  const upperLevel = level.toUpperCase();
  for (const [key, value] of Object.entries(descriptions)) {
    if (upperLevel.includes(key)) {
      return value;
    }
  }

  return 'Various Levels';
}

/**
 * Подсчет общего количества уроков в модулях
 */
export function countTotalLessons(modules: Array<{ lessons: string[] }>): number {
  return modules.reduce((total, module) => total + module.lessons.length, 0);
}

/**
 * Генерация уникального ID для enrollment
 */
export function generateEnrollmentId(courseId: string, studentAddress: string): string {
  const timestamp = Date.now();
  const hash = `${courseId}-${studentAddress}-${timestamp}`.substring(0, 20);
  return `enroll_${hash}`;
}

