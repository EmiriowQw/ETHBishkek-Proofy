# 📐 Структура English Demo Platform

## 🗂️ Архитектура проекта

```
ETHBishkek-Proofy-main/
│
├── pages/
│   ├── english-demo.tsx                    # 🏠 Главная демо-страница
│   ├── english-demo/
│   │   └── [id].tsx                        # 📄 Детальная страница курса
│   │
│   └── api/
│       └── english-courses/
│           ├── index.ts                    # 📡 GET /api/english-courses
│           ├── [id].ts                     # 📡 GET /api/english-courses/:id
│           └── enroll.ts                   # 📡 POST /api/english-courses/enroll
│
├── components/
│   └── EnglishCourseCard.tsx              # 🎴 Компонент карточки курса
│
└── Documentation/
    ├── ENGLISH_DEMO_README.md             # 📚 Полная документация
    ├── ENGLISH_DEMO_QUICK_START.md        # 🚀 Быстрый старт
    └── ENGLISH_DEMO_STRUCTURE.md          # 📐 Этот файл
```

## 🔄 Поток данных

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  /english-demo (Main Page)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • Hero Section                                        │  │
│  │  • Level Filter Buttons (All, A1, A2, B1, B2, C1)    │  │
│  │  • Course Grid (6 cards)                              │  │
│  │  • Statistics                                          │  │
│  │  • Toggle: "API Demo" button                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    ┌──────────────┐              ┌──────────────────┐
    │ View Courses │              │    API Demo      │
    │    Mode      │              │      Mode        │
    └──────────────┘              └──────────────────┘
            │                               │
            ▼                               ▼
    ┌──────────────┐              ┌──────────────────┐
    │ Click Card   │              │ Shows:           │
    │      ↓       │              │ • Endpoints      │
    │ /english-    │              │ • Live Example   │
    │  demo/[id]   │              │ • JSON Response  │
    │              │              │ • Code Samples   │
    └──────────────┘              └──────────────────┘
```

## 🔌 API Endpoints Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTES                              │
│                                                              │
│  1. GET /api/english-courses                                │
│     Input: ?level=B1 (optional)                             │
│     Output: { success, count, courses[] }                   │
│                                                              │
│  2. GET /api/english-courses/:id                            │
│     Input: id (course ID)                                   │
│     Output: { success, course{...} }                        │
│                                                              │
│  3. POST /api/english-courses/enroll                        │
│     Input: { courseId, studentAddress }                     │
│     Output: { success, enrollment{...} }                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  • Mock data в памяти (6 курсов)                           │
│  • Можно заменить на реальную БД                            │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 UI Components Hierarchy

```
/english-demo
├── Navigation Bar
│   ├── Logo & Title
│   ├── Links (Home, API Demo)
│   └── Connect Wallet Button
│
├── Hero Section
│   ├── Title
│   ├── Description
│   └── Features Icons
│
├── Filter Section
│   └── Level Buttons (All, A1-C1)
│
├── Courses Grid
│   ├── EnglishCourseCard #1
│   │   ├── Emoji Icon
│   │   ├── Level Badge
│   │   ├── Title
│   │   ├── Description
│   │   ├── Instructor
│   │   ├── Stats (lessons, duration, rating)
│   │   ├── Topics Tags
│   │   └── Enroll Button
│   │
│   ├── EnglishCourseCard #2
│   ├── EnglishCourseCard #3
│   └── ... (до 6 карточек)
│
└── Statistics Section
    ├── Total Courses
    ├── Total Students
    ├── Average Rating
    └── Certificate Rate

/english-demo/[id]
├── Navigation Bar
├── Course Header (Gradient)
│   ├── Level Badge
│   ├── Certificate Badge
│   ├── Title
│   ├── Description
│   └── Stats Bar
│
├── Main Content (Left)
│   ├── What You'll Learn
│   ├── Course Content (Modules)
│   ├── Requirements
│   └── Instructor Info
│
└── Sidebar (Right, Sticky)
    ├── Price
    ├── Enroll Button
    ├── Course Details
    └── Included Features
```

## 📊 Data Structure

### Course Object
```typescript
interface Course {
  id: string;              // "beginner-english-a1"
  title: string;           // "English for Beginners (A1)"
  level: string;           // "A1"
  description: string;     // "Start your English learning..."
  duration: string;        // "6 weeks"
  lessons: number;         // 24
  students: number;        // 1523
  rating: number;          // 4.8
  instructor: string;      // "Sarah Johnson"
  price: string;           // "Free"
  topics: string[];        // ["Grammar", "Vocabulary", ...]
  image: string;           // "🌱"
  certificate: boolean;    // true
}
```

### Detailed Course Object
```typescript
interface CourseDetail extends Course {
  reviews: number;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  modules: Array<{
    title: string;
    lessons: string[];
  }>;
  requirements: string[];
  whatYouLearn: string[];
}
```

## 🎯 User Journey

### Scenario 1: Просмотр курсов
```
1. User открывает /english-demo
2. Видит 6 курсов английского
3. Может фильтровать по уровню
4. Кликает на карточку
5. Переход на /english-demo/[id]
6. Видит детальную информацию
7. Может записаться (если подключен кошелек)
```

### Scenario 2: Демонстрация API
```
1. User открывает /english-demo
2. Кликает "API Demo"
3. Видит документацию API
4. Выбирает level в dropdown
5. Видит изменение URL запроса
6. Видит JSON ответ в реальном времени
7. Может скопировать примеры кода
```

## 🔄 State Management

```
/english-demo State:
├── mounted: boolean
├── courses: Course[]
├── loading: boolean
├── selectedLevel: string
└── showApiDemo: boolean

/english-demo/[id] State:
├── mounted: boolean
├── course: CourseDetail | null
├── loading: boolean
├── enrolling: boolean
└── isConnected: boolean
```

## 🎨 Styling System

### Colors
- Primary: Blue (#3B82F6) → Indigo (#4F46E5)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray scale

### Level Colors
- A1: Green (Beginner)
- A2: Blue (Elementary)
- B1: Yellow (Intermediate)
- B2: Orange (Upper-Intermediate)
- C1: Red (Advanced)
- Business: Purple

### Components
- Cards: `bg-white rounded-xl shadow-lg`
- Buttons: `bg-gradient-to-r from-blue-500 to-indigo-600`
- Badges: Level-based colors
- Gradients: Used for headers and CTAs

## 🚀 Performance

### Optimizations
- ✅ Client-side rendering с SSR готовностью
- ✅ Lazy loading компонентов
- ✅ Optimized images (emojis)
- ✅ Minimal API calls
- ✅ Cached responses где возможно

### Loading States
- Skeleton loaders для курсов
- Spinner для деталей
- Disabled states для кнопок
- Toast notifications для feedback

## 🔐 Integration Points

### Blockchain
- Wallet connection via RainbowKit
- Gasless minting через контракты
- NFT certificates on-chain
- Status Network integration

### Future Extensions
- ✨ Real database (PostgreSQL/MongoDB)
- ✨ User progress tracking
- ✨ Lesson completion
- ✨ Quiz system
- ✨ Certificate claiming
- ✨ Admin dashboard

