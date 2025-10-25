import { NextApiRequest, NextApiResponse } from 'next';

// Детальная информация о курсе
const courseDetails: Record<string, any> = {
  'beginner-english-a1': {
    id: 'beginner-english-a1',
    title: 'English for Beginners (A1)',
    level: 'A1',
    description: 'Start your English learning journey with this comprehensive beginner course.',
    duration: '6 weeks',
    lessons: 24,
    students: 1523,
    rating: 4.8,
    reviews: 342,
    instructor: {
      name: 'Sarah Johnson',
      bio: 'TESOL certified with 10+ years of teaching experience',
      avatar: '👩‍🏫',
    },
    price: 'Free',
    certificate: true,
    modules: [
      {
        title: 'Week 1-2: The Basics',
        lessons: ['Alphabet & Sounds', 'Greetings', 'Basic Verbs', 'Numbers 1-100'],
      },
      {
        title: 'Week 3-4: Building Blocks',
        lessons: ['Present Simple', 'Questions', 'Common Nouns', 'Daily Routines'],
      },
      {
        title: 'Week 5-6: Practical English',
        lessons: ['Shopping', 'Directions', 'Food & Drinks', 'Family & Friends'],
      },
    ],
    requirements: ['No prior knowledge needed', 'Internet connection', 'Dedication to practice'],
    whatYouLearn: [
      'Understand and use basic English phrases',
      'Introduce yourself and others',
      'Ask and answer simple questions',
      'Interact in a simple way',
    ],
  },
  'intermediate-english-b1': {
    id: 'intermediate-english-b1',
    title: 'Intermediate English (B1)',
    level: 'B1',
    description: 'Develop fluency and confidence in everyday English communication.',
    duration: '10 weeks',
    lessons: 40,
    students: 987,
    rating: 4.7,
    reviews: 218,
    instructor: {
      name: 'Emma Wilson',
      bio: 'Cambridge certified English teacher with international experience',
      avatar: '👩‍💼',
    },
    price: 'Free',
    certificate: true,
    modules: [
      {
        title: 'Weeks 1-3: Grammar Mastery',
        lessons: ['Past Perfect', 'Conditionals', 'Passive Voice', 'Reported Speech'],
      },
      {
        title: 'Weeks 4-6: Communication Skills',
        lessons: ['Expressing Opinions', 'Making Complaints', 'Giving Advice', 'Storytelling'],
      },
      {
        title: 'Weeks 7-10: Real World English',
        lessons: ['Job Interviews', 'Travel Situations', 'Phone Calls', 'Social Events'],
      },
    ],
    requirements: ['A2 level or equivalent', 'Willingness to practice speaking', 'Basic grammar knowledge'],
    whatYouLearn: [
      'Handle most travel situations',
      'Describe experiences and events',
      'Explain opinions and plans',
      'Understand clear standard speech',
    ],
  },
  'business-english': {
    id: 'business-english',
    title: 'Business English Professional',
    level: 'B2-C1',
    description: 'Master professional English for business communication and career advancement.',
    duration: '8 weeks',
    lessons: 32,
    students: 892,
    rating: 4.9,
    reviews: 187,
    instructor: {
      name: 'Robert Anderson',
      bio: 'Former business consultant, specializing in corporate English training',
      avatar: '👨‍💼',
    },
    price: 'Free',
    certificate: true,
    modules: [
      {
        title: 'Weeks 1-2: Professional Communication',
        lessons: ['Email Etiquette', 'Formal Letters', 'Meeting Language', 'Phone Skills'],
      },
      {
        title: 'Weeks 3-5: Business Situations',
        lessons: ['Negotiations', 'Presentations', 'Networking', 'Small Talk'],
      },
      {
        title: 'Weeks 6-8: Advanced Skills',
        lessons: ['Report Writing', 'Project Management', 'Conflict Resolution', 'Leadership Language'],
      },
    ],
    requirements: ['B2 level English', 'Professional work experience helpful', 'Access to computer'],
    whatYouLearn: [
      'Write professional emails and reports',
      'Deliver confident presentations',
      'Negotiate effectively',
      'Network professionally',
    ],
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }
    
    const course = courseDetails[id];
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      course,
    });
  }
  
  res.status(405).json({ success: false, message: 'Method not allowed' });
}

