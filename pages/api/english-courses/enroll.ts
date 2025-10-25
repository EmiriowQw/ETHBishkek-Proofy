import { NextApiRequest, NextApiResponse } from 'next';

// API эндпоинт для записи на курс (демонстрация)
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { courseId, studentAddress, studentName } = req.body;
    
    // Валидация
    if (!courseId || !studentAddress) {
      return res.status(400).json({
        success: false,
        message: 'courseId and studentAddress are required',
      });
    }
    
    // Симуляция записи на курс
    console.log('Enrollment request:', { courseId, studentAddress, studentName });
    
    // Успешный ответ
    return res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: {
        enrollmentId: `enr_${Date.now()}`,
        courseId,
        studentAddress,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        status: 'active',
      },
    });
  }
  
  res.status(405).json({ success: false, message: 'Method not allowed' });
}

