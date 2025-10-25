import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface CourseDetail {
  id: string;
  title: string;
  level: string;
  description: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  reviews: number;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  price: string;
  certificate: boolean;
  modules: Array<{
    title: string;
    lessons: string[];
  }>;
  requirements: string[];
  whatYouLearn: string[];
}

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/english-courses/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setCourse(data.course);
      } else {
        toast.error('Course not found');
        router.push('/english-demo');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setEnrolling(true);
      const response = await fetch('/api/english-courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: id,
          studentAddress: address,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Successfully enrolled! 🎉');
        console.log('Enrollment details:', data.enrollment);
      } else {
        toast.error(data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <Link href="/english-demo" className="text-blue-600 hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    if (level.includes('A1')) return 'bg-green-100 text-green-800';
    if (level.includes('A2')) return 'bg-blue-100 text-blue-800';
    if (level.includes('B1')) return 'bg-yellow-100 text-yellow-800';
    if (level.includes('B2')) return 'bg-orange-100 text-orange-800';
    if (level.includes('C1')) return 'bg-red-100 text-red-800';
    return 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/english-demo" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">←</span>
              <span className="text-lg font-semibold text-gray-700">Back to Courses</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Home
              </Link>
              {isConnected && <ConnectButton />}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-2xl p-8 md:p-12 text-white mb-8">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getLevelColor(course.level)} text-gray-900`}>
                {course.level}
              </span>
              {course.certificate && (
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold">
                  🎓 Certificate Included
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {course.title}
            </h1>
            
            <p className="text-xl text-blue-100 mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⭐</span>
                <span className="font-semibold">{course.rating}</span>
                <span className="ml-1 text-blue-200">({course.reviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">👥</span>
                <span>{course.students.toLocaleString()} students enrolled</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📚</span>
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⏱️</span>
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-900">
                      {module.title}
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center text-gray-700">
                            <span className="text-blue-500 mr-2">📖</span>
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor</h2>
              <div className="flex items-start space-x-4">
                <div className="text-5xl">{course.instructor.avatar}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {course.instructor.name}
                  </h3>
                  <p className="text-gray-600">{course.instructor.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {course.price}
                </div>
                <p className="text-gray-600 text-sm">Full lifetime access</p>
              </div>

              {!isConnected ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    Connect your wallet to enroll
                  </p>
                  <div className="flex justify-center">
                    <ConnectButton />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-semibold">{course.lessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-semibold">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-semibold">{course.students.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-semibold text-green-600">
                    {course.certificate ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Lifetime access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    NFT Certificate
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Blockchain verified
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Gasless minting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

