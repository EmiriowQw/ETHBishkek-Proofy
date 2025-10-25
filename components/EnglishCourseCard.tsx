import React, { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Course } from '../types/english-courses';
import { getLevelColor, formatStudentCount } from '../utils/courseHelpers';

interface EnglishCourseCardProps {
  course: Course;
}

function EnglishCourseCard({ course }: EnglishCourseCardProps) {
  const router = useRouter();

  // Мемоизация цвета уровня
  const levelColorClass = useMemo(
    () => getLevelColor(course.level),
    [course.level]
  );

  // Мемоизация форматированного количества студентов
  const formattedStudents = useMemo(
    () => formatStudentCount(course.students),
    [course.students]
  );

  // Мемоизация обработчика клика
  const handleClick = useCallback(() => {
    router.push(`/english-demo/${course.id}`);
  }, [router, course.id]);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View ${course.title} course`}
    >
      {/* Header with emoji icon */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-center">
        <div className="text-6xl mb-2" role="img" aria-label="Course icon">
          {course.image}
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${levelColorClass}`}>
          {course.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="mr-1">👨‍🏫</span>
          <span>{course.instructor}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center">
            <span className="mr-1">📚</span>
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⏱️</span>
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⭐</span>
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {course.topics.slice(0, 2).map((topic, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {topic}
              </span>
            ))}
            {course.topics.length > 2 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                +{course.topics.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1" role="img" aria-label="Students">👥</span>
            <span>{formattedStudents} students</span>
          </div>
          
          {course.certificate && (
            <div className="flex items-center text-sm text-green-600 font-semibold">
              <span className="mr-1">🎓</span>
              <span>Certificate</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-4">
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">
            Enroll Now • {course.price}
          </button>
        </div>
      </div>
    </div>
  );
}

// Мемоизация компонента для предотвращения лишних ре-рендеров
export default React.memo(EnglishCourseCard, (prevProps, nextProps) => {
  // Сравниваем только ID курса, так как курсы статичны
  return prevProps.course.id === nextProps.course.id;
});

