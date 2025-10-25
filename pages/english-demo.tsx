import { useState, useEffect, useMemo, useCallback } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import EnglishCourseCard from '../components/EnglishCourseCard';
import { CourseSkeletonGrid } from '../components/CourseSkeleton';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorFallback from '../components/ErrorFallback';
import toast from 'react-hot-toast';
import { Course } from '../types/english-courses';
import { API_ENDPOINTS, LEVEL_FILTERS, ERROR_MESSAGES } from '../constants/api';
import { handleApiError, fetchWithRetry, safeJsonParse } from '../utils/errorHandler';

export default function EnglishDemo() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showApiDemo, setShowApiDemo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Загрузка курсов только один раз при монтировании
  useEffect(() => {
    if (mounted) {
      fetchCourses();
    }
  }, [mounted]);

  const fetchCourses = useCallback(async (level?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = level && level !== 'all' 
        ? `${API_ENDPOINTS.COURSES}?level=${level}` 
        : API_ENDPOINTS.COURSES;
      
      // Использование retry механизма
      const data = await fetchWithRetry(async () => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(ERROR_MESSAGES.FAILED_TO_LOAD);
        }
        return safeJsonParse(response);
      }) as any;
      
      if (data.success) {
        setCourses(data.courses);
        // Удалили избыточный toast при каждой загрузке
      } else {
        throw new Error(data.message || ERROR_MESSAGES.FAILED_TO_LOAD);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLevelFilter = useCallback((level: string) => {
    setSelectedLevel(level);
    fetchCourses(level === 'all' ? undefined : level);
  }, [fetchCourses]);

  // Мемоизация статистики
  const stats = useMemo(() => {
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const avgRating = courses.length > 0
      ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
      : 0;
    
    return {
      totalCourses: courses.length,
      totalStudents,
      avgRating: avgRating.toFixed(1),
    };
  }, [courses]);

  // Мемоизация filtered courses для API Demo
  const apiDemoData = useMemo(() => {
    return {
      success: true,
      count: courses.length,
      courses: courses.map(c => ({
        id: c.id,
        title: c.title,
        level: c.level,
        duration: c.duration,
        lessons: c.lessons,
        students: c.students,
        rating: c.rating
      }))
    };
  }, [courses]);

  if (!mounted) {
    return null;
  }

  if (error && courses.length === 0) {
    return (
      <ErrorFallback
        message={error}
        resetError={() => {
          setError(null);
          fetchCourses();
        }}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-3xl" role="img" aria-label="Books">📚</span>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    English Learning Platform
                  </h1>
                  <p className="text-xs text-gray-500">API Integration Demo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
                <button 
                  onClick={() => setShowApiDemo(!showApiDemo)}
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                  aria-label={showApiDemo ? 'View Courses' : 'View API Demo'}
                >
                  {showApiDemo ? 'View Courses' : 'API Demo'}
                </button>
                {isConnected && <ConnectButton />}
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          {!showApiDemo ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  Master English with Expert Courses
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                  From beginner to advanced. All courses include NFT certificates verified on blockchain.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" role="img" aria-label="Check">✅</span>
                    <span>Free Courses</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" role="img" aria-label="Graduate">🎓</span>
                    <span>NFT Certificates</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" role="img" aria-label="Lightning">⚡</span>
                    <span>API Integration</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" role="img" aria-label="Fuel">⛽</span>
                    <span>Gasless Minting</span>
                  </div>
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Level</h3>
                  <div className="flex flex-wrap gap-3">
                    {LEVEL_FILTERS.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleLevelFilter(level)}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                          selectedLevel === level
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        aria-pressed={selectedLevel === level}
                        aria-label={`Filter by ${level === 'all' ? 'all levels' : `level ${level}`}`}
                      >
                        {level === 'all' ? 'All Levels' : level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              {loading ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Loading courses...
                    </h3>
                  </div>
                  <CourseSkeletonGrid />
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Courses</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => fetchCourses()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Available Courses ({courses.length})
                    </h3>
                    <div className="text-sm text-gray-600">
                      🔗 Powered by API Integration
                    </div>
                  </div>
                  
                  {courses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        No courses found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try selecting a different level filter
                      </p>
                      <button
                        onClick={() => handleLevelFilter('all')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Show All Courses
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {courses.map((course) => (
                        <EnglishCourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Stats Section */}
              <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Platform Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {stats.totalCourses}
                    </div>
                    <div className="text-gray-600">Active Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {stats.totalStudents.toLocaleString()}
                    </div>
                    <div className="text-gray-600">Total Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {stats.avgRating}★
                    </div>
                    <div className="text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
                    <div className="text-gray-600">Get Certificate</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* API Demo Section */
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  API Integration Demo
                </h2>
                <p className="text-lg text-gray-600">
                  This page demonstrates how the frontend integrates with our English courses API
                </p>
              </div>

              {/* API Endpoint */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔗</span>
                  API Endpoint
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  GET {API_ENDPOINTS.COURSES}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Query Parameters:</span>
                    <ul className="ml-4 mt-2 space-y-1 text-gray-600">
                      <li>• <code className="bg-gray-100 px-2 py-1 rounded">level</code> - Filter by CEFR level (A1, A2, B1, B2, C1)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Live Example */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚡</span>
                  Live API Call Example
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Try it: Select a level to filter courses
                    </label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedLevel}
                      onChange={(e) => handleLevelFilter(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="A1">A1 - Beginner</option>
                      <option value="A2">A2 - Elementary</option>
                      <option value="B1">B1 - Intermediate</option>
                      <option value="B2">B2 - Upper Intermediate</option>
                      <option value="C1">C1 - Advanced</option>
                    </select>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Request URL:</div>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                      {selectedLevel === 'all' 
                        ? API_ENDPOINTS.COURSES 
                        : `${API_ENDPOINTS.COURSES}?level=${selectedLevel}`}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Response:</div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                      <pre>{JSON.stringify(apiDemoData, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Code */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💻</span>
                  Frontend Integration Code
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">React/Next.js Example:</div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`const fetchCourses = async (level?: string) => {
  const url = level 
    ? \`/api/english-courses?level=\${level}\` 
    : '/api/english-courses';
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.success) {
    setCourses(data.courses);
  }
};

// Usage
fetchCourses(); // Get all courses
fetchCourses('B1'); // Get B1 level courses`}</pre>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">✨ Key Features:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ RESTful API design</li>
                      <li>✓ Level-based filtering</li>
                      <li>✓ Real-time data fetching</li>
                      <li>✓ JSON response format</li>
                      <li>✓ Easy to integrate with any frontend</li>
                      <li>✓ Error handling with retry mechanism</li>
                      <li>✓ Input validation for security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
