// API константы для English Demo

export const API_ENDPOINTS = {
  COURSES: '/api/english-courses',
  COURSE_DETAIL: (id: string) => `/api/english-courses/${id}`,
  ENROLL: '/api/english-courses/enroll',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  COURSE_NOT_FOUND: 'Course not found.',
  FAILED_TO_LOAD: 'Failed to load courses. Please try again.',
  FAILED_TO_ENROLL: 'Failed to enroll in course. Please try again.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet first.',
  INVALID_COURSE_ID: 'Invalid course ID.',
  INVALID_WALLET_ADDRESS: 'Invalid wallet address.',
  INVALID_LEVEL: 'Invalid course level.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

export const SUCCESS_MESSAGES = {
  COURSES_LOADED: (count: number) => `Loaded ${count} course${count !== 1 ? 's' : ''}`,
  ENROLLMENT_SUCCESS: 'Successfully enrolled! 🎉',
  ENROLLMENT_PENDING: 'Enrollment request submitted.',
} as const;

export const COURSE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const LEVEL_FILTERS = ['all', ...COURSE_LEVELS] as const;

export type CourseLevel = typeof COURSE_LEVELS[number];
export type LevelFilter = typeof LEVEL_FILTERS[number];

