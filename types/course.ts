export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  lessons: number;
  completed: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: "video" | "text" | "quiz";
  duration: number; // in minutes
  completed: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  quizScores: { [quizId: string]: number };
  totalProgress: number;
  completed: boolean;
  completionDate?: Date;
}
