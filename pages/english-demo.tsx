import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import EnglishCourseCard from '../components/EnglishCourseCard';
import toast from 'react-hot-toast';

interface Course {
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

export default function EnglishDemo() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showApiDemo, setShowApiDemo] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCourses();
  }, []);

  const fetchCourses = async (level?: string) => {
    try {
      setLoading(true);
      const url = level && level !== 'all' 
        ? `/api/english-courses?level=${level}` 
        : '/api/english-courses';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
        toast.success(`Loaded ${data.count} courses`);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelFilter = (level: string) => {
    setSelectedLevel(level);
    fetchCourses(level === 'all' ? undefined : level);
  };

  if (!mounted) {
    return null;
  }

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">📚</span>
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
                  <span className="text-2xl mr-2">✅</span>
                  <span>Free Courses</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🎓</span>
                  <span>NFT Certificates</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⚡</span>
                  <span>API Integration</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⛽</span>
                  <span>Gasless Minting</span>
                </div>
              </div>
            </div>

            {/* Level Filter */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Level</h3>
                <div className="flex flex-wrap gap-3">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelFilter(level)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedLevel === level
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level === 'all' ? 'All Levels' : level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map((course) => (
                    <EnglishCourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            )}

            {/* Stats Section */}
            <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Platform Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
                  <div className="text-gray-600">Active Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">5,797</div>
                  <div className="text-gray-600">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">4.8★</div>
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
                GET /api/english-courses
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                      ? '/api/english-courses' 
                      : `/api/english-courses?level=${selectedLevel}`}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Response:</div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                    <pre>{JSON.stringify({ 
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
                    }, null, 2)}</pre>
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

