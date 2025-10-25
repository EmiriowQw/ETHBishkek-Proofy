import { NextApiRequest, NextApiResponse } from 'next';
import { getCourseById } from '../../../data/englishCoursesData';
import { isValidCourseId } from '../../../utils/validators';
import { ERROR_MESSAGES } from '../../../constants/api';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: ERROR_MESSAGES.SERVER_ERROR 
    });
  }

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_COURSE_ID,
      });
    }

    if (!isValidCourseId(id)) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_COURSE_ID,
      });
    }
    
    const course = getCourseById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.COURSE_NOT_FOUND,
      });
    }
    
    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Error in course detail API:', error);
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
}
