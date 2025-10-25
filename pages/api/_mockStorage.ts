// Общее хранилище для mock данных (имитация базы данных)
// В реальном приложении это была бы настоящая БД

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string | null;
  lessons: any[];
  lessonsCount: number;
  creatorAddress: string;
  status: "draft" | "submitted" | "verified" | "rejected";
  createdAt: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface VerificationRequest {
  id: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  studentAddress: string;
  lessonsCount: number;
  proofOfCompletion: string;
  submittedAt: string;
  status: "pending" | "verified" | "rejected";
}

// Глобальное хранилище курсов
const coursesStorage = new Map<string, Course>([
  [
    "course_demo_1",
    {
      id: "course_demo_1",
      title: "Introduction to Web3 Development",
      description: "Learn blockchain fundamentals and smart contract development",
      duration: "4 weeks",
      lessons: [],
      lessonsCount: 8,
      creatorAddress: "0x1234567890abcdef1234567890abcdef12345678",
      status: "draft",
      createdAt: "2024-10-20T10:00:00.000Z",
    },
  ],
  [
    "course_demo_2",
    {
      id: "course_demo_2",
      title: "Smart Contract Security",
      description: "Advanced security practices for smart contract development",
      duration: "3 weeks",
      lessons: [],
      lessonsCount: 6,
      creatorAddress: "0x1234567890abcdef1234567890abcdef12345678",
      status: "submitted",
      createdAt: "2024-10-18T10:00:00.000Z",
      submittedAt: "2024-10-22T14:30:00.000Z",
    },
  ],
  [
    "course_demo_3",
    {
      id: "course_demo_3",
      title: "DeFi Protocols Explained",
      description: "Understanding decentralized finance protocols and mechanisms",
      duration: "6 weeks",
      lessons: [],
      lessonsCount: 12,
      creatorAddress: "0x1234567890abcdef1234567890abcdef12345678",
      status: "verified",
      createdAt: "2024-10-10T10:00:00.000Z",
      submittedAt: "2024-10-15T10:00:00.000Z",
      verifiedAt: "2024-10-17T09:15:00.000Z",
    },
  ],
  [
    "course_demo_4",
    {
      id: "course_demo_4",
      title: "Basic Solidity Programming",
      description: "Introduction to Solidity programming language",
      duration: "2 weeks",
      lessons: [],
      lessonsCount: 4,
      creatorAddress: "0x1234567890abcdef1234567890abcdef12345678",
      status: "rejected",
      createdAt: "2024-10-12T10:00:00.000Z",
      submittedAt: "2024-10-16T10:00:00.000Z",
      rejectedAt: "2024-10-18T11:30:00.000Z",
      rejectionReason: "Course content is too basic and lacks sufficient depth. Please add more advanced topics, practical examples, and at least 2 more lessons covering intermediate concepts. Also include code examples and exercises for each lesson.",
    },
  ],
]);

// Глобальное хранилище запросов на верификацию
const verificationRequestsStorage = new Map<string, VerificationRequest>([
  [
    "req_demo_1",
    {
      id: "req_demo_1",
      courseId: "course_demo_2",
      courseTitle: "Smart Contract Security",
      courseDescription: "Advanced security practices for smart contract development",
      studentAddress: "0x1234567890abcdef1234567890abcdef12345678",
      lessonsCount: 6,
      proofOfCompletion: "I completed all 6 lessons covering topics including reentrancy attacks, access control, integer overflow/underflow, and secure coding practices. Implemented security patterns in practice projects and successfully audited sample contracts.",
      submittedAt: "2024-10-22T14:30:00.000Z",
      status: "pending",
    },
  ],
  [
    "req_demo_2",
    {
      id: "req_demo_2",
      courseId: "course_abc_123",
      courseTitle: "NFT Development Masterclass",
      courseDescription: "Complete guide to creating and deploying NFT collections",
      studentAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      lessonsCount: 10,
      proofOfCompletion: "Completed comprehensive NFT course including ERC-721 and ERC-1155 standards, metadata management, IPFS integration, minting mechanisms, and marketplace integration. Built and deployed a full NFT collection as final project.",
      submittedAt: "2024-10-23T09:15:00.000Z",
      status: "pending",
    },
  ],
]);

// Экспортируем функции для работы с хранилищем
export const MockStorage = {
  // Курсы
  courses: {
    getAll: () => Array.from(coursesStorage.values()),
    
    getByAddress: (address: string) => {
      return Array.from(coursesStorage.values())
        .filter(course => course.creatorAddress.toLowerCase() === address.toLowerCase());
    },
    
    getById: (id: string) => {
      return coursesStorage.get(id);
    },
    
    create: (course: Course) => {
      coursesStorage.set(course.id, course);
      console.log(`📚 Course created: ${course.id} - ${course.title}`);
      return course;
    },
    
    update: (id: string, updates: Partial<Course>) => {
      const course = coursesStorage.get(id);
      if (course) {
        const updated = { ...course, ...updates };
        coursesStorage.set(id, updated);
        console.log(`📝 Course updated: ${id} - Status: ${updated.status}`);
        return updated;
      }
      return null;
    },
    
    delete: (id: string) => {
      return coursesStorage.delete(id);
    },
  },

  // Запросы на верификацию
  verificationRequests: {
    getAll: () => Array.from(verificationRequestsStorage.values()),
    
    getPending: () => {
      return Array.from(verificationRequestsStorage.values())
        .filter(req => req.status === "pending");
    },
    
    getById: (id: string) => {
      return verificationRequestsStorage.get(id);
    },
    
    create: (request: VerificationRequest) => {
      verificationRequestsStorage.set(request.id, request);
      console.log(`📋 Verification request created: ${request.id} for course ${request.courseId}`);
      return request;
    },
    
    update: (id: string, updates: Partial<VerificationRequest>) => {
      const request = verificationRequestsStorage.get(id);
      if (request) {
        const updated = { ...request, ...updates };
        verificationRequestsStorage.set(id, updated);
        console.log(`✅ Verification request updated: ${id} - Status: ${updated.status}`);
        return updated;
      }
      return null;
    },
    
    delete: (id: string) => {
      return verificationRequestsStorage.delete(id);
    },
  },

  // Утилиты
  utils: {
    clearAll: () => {
      coursesStorage.clear();
      verificationRequestsStorage.clear();
      console.log("🗑️ All mock data cleared");
    },
    
    getCourseStats: () => {
      const courses = Array.from(coursesStorage.values());
      return {
        total: courses.length,
        draft: courses.filter(c => c.status === "draft").length,
        submitted: courses.filter(c => c.status === "submitted").length,
        verified: courses.filter(c => c.status === "verified").length,
        rejected: courses.filter(c => c.status === "rejected").length,
      };
    },
  },
};

