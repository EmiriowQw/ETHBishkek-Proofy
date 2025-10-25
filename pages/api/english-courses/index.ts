import { NextApiRequest, NextApiResponse } from 'next';

// Демо-данные курсов английского языка
const englishCourses = [
  {
    id: 'beginner-english-a1',
    title: 'English for Beginners (A1)',
    level: 'A1',
    description: 'Start your English learning journey. Learn basic grammar, vocabulary, and everyday phrases.',
    duration: '6 weeks',
    lessons: 24,
    students: 1523,
    rating: 4.8,
    instructor: 'Sarah Johnson',
    price: 'Free',
    topics: ['Alphabet & Pronunciation', 'Basic Grammar', 'Common Phrases', 'Numbers & Time'],
    image: '🌱',
    certificate: true,
  },
  {
    id: 'elementary-english-a2',
    title: 'Elementary English (A2)',
    level: 'A2',
    description: 'Build on your foundation. Learn to describe experiences, events, and express opinions.',
    duration: '8 weeks',
    lessons: 32,
    students: 1205,
    rating: 4.9,
    instructor: 'Michael Brown',
    price: 'Free',
    topics: ['Past Tenses', 'Comparisons', 'Daily Conversations', 'Travel English'],
    image: '🌿',
    certificate: true,
  },
  {
    id: 'intermediate-english-b1',
    title: 'Intermediate English (B1)',
    level: 'B1',
    description: 'Develop fluency and confidence. Handle most situations when traveling and describe experiences.',
    duration: '10 weeks',
    lessons: 40,
    students: 987,
    rating: 4.7,
    instructor: 'Emma Wilson',
    price: 'Free',
    topics: ['Complex Grammar', 'Idiomatic Expressions', 'Writing Skills', 'Presentations'],
    image: '🌳',
    certificate: true,
  },
  {
    id: 'upper-intermediate-b2',
    title: 'Upper-Intermediate English (B2)',
    level: 'B2',
    description: 'Master complex texts and spontaneous interaction. Prepare for professional communication.',
    duration: '12 weeks',
    lessons: 48,
    students: 756,
    rating: 4.9,
    instructor: 'David Martinez',
    price: 'Free',
    topics: ['Advanced Grammar', 'Business English', 'Academic Writing', 'Debates'],
    image: '🌲',
    certificate: true,
  },
  {
    id: 'advanced-english-c1',
    title: 'Advanced English (C1)',
    level: 'C1',
    description: 'Near-native proficiency. Express yourself fluently and spontaneously in complex situations.',
    duration: '14 weeks',
    lessons: 56,
    students: 432,
    rating: 4.8,
    instructor: 'Jennifer Lee',
    price: 'Free',
    topics: ['Nuanced Language', 'Cultural References', 'Professional Writing', 'Critical Analysis'],
    image: '🏆',
    certificate: true,
  },
  {
    id: 'business-english',
    title: 'Business English Professional',
    level: 'B2-C1',
    description: 'Master business communication, negotiations, presentations, and professional correspondence.',
    duration: '8 weeks',
    lessons: 32,
    students: 892,
    rating: 4.9,
    instructor: 'Robert Anderson',
    price: 'Free',
    topics: ['Meeting Language', 'Email Writing', 'Negotiations', 'Presentations'],
    image: '💼',
    certificate: true,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { level } = req.query;
    
    // Фильтрация по уровню, если указан
    if (level && typeof level === 'string') {
      const filtered = englishCourses.filter(course => 
        course.level.includes(level.toUpperCase())
      );
      return res.status(200).json({
        success: true,
        count: filtered.length,
        courses: filtered,
      });
    }
    
    // Возврат всех курсов
    return res.status(200).json({
      success: true,
      count: englishCourses.length,
      courses: englishCourses,
    });
  }
  
  res.status(405).json({ success: false, message: 'Method not allowed' });
}

