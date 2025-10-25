import { NextApiRequest, NextApiResponse } from 'next';
import { englishCourses, filterCoursesByLevel } from '../../../data/englishCoursesData';
import { isValidLevelFilter } from '../../../utils/validators';
import { ERROR_MESSAGES } from '../../../constants/api';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: ERROR_MESSAGES.SERVER_ERROR 
    });
  }

  try {
    const { level } = req.query;
    
    // Фильтрация по уровню, если указан
    if (level) {
      if (typeof level !== 'string' || !isValidLevelFilter(level)) {
        return res.status(400).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_LEVEL,
        });
      }
      
      const filtered = filterCoursesByLevel(level);
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
  } catch (error) {
    console.error('Error in english-courses API:', error);
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
}

