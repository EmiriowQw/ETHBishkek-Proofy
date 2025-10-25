import { NextApiRequest, NextApiResponse } from 'next';
import { validateEnrollmentData } from '../../../utils/validators';
import { generateEnrollmentId } from '../../../utils/courseHelpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../constants/api';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: ERROR_MESSAGES.SERVER_ERROR 
    });
  }

  try {
    const { courseId, studentAddress } = req.body;
    
    // Валидация данных
    const validation = validateEnrollmentData({ courseId, studentAddress });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', '),
      });
    }
    
    // Генерация enrollment
    const enrollmentId = generateEnrollmentId(courseId, studentAddress);
    
    // Симуляция записи на курс
    console.log('✅ Enrollment successful:', { courseId, studentAddress });
    
    // Успешный ответ
    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.ENROLLMENT_SUCCESS,
      enrollment: {
        id: enrollmentId,
        courseId,
        studentAddress,
        enrolledAt: new Date().toISOString(),
        status: 'active' as const,
      },
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.FAILED_TO_ENROLL,
    });
  }
}

