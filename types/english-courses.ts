// Типы для English Demo сайта

export interface Course {
  id: string;
  title: string;
  level: string;
  description: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  instructor: string;
  price: string;
  topics: string[];
  image: string;
  certificate: boolean;
}

export interface CourseDetail extends Omit<Course, 'instructor'> {
  reviews: number;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  modules: Array<{
    title: string;
    lessons: string[];
  }>;
  requirements: string[];
  whatYouLearn: string[];
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentAddress: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CoursesListResponse {
  success: boolean;
  count: number;
  courses: Course[];
}

export interface CourseDetailResponse {
  success: boolean;
  course: CourseDetail;
}

export interface EnrollmentResponse {
  success: boolean;
  enrollment: Enrollment;
  message?: string;
}

