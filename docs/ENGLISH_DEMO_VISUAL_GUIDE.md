# 🎨 Visual Guide - English Demo Platform

## 🖼️ Что вы увидите

### 1. Главная страница: `/english-demo`

```
╔══════════════════════════════════════════════════════════════════╗
║  📚 English Learning Platform          [Home] [API Demo] [👤]   ║
║     API Integration Demo                                         ║
╚══════════════════════════════════════════════════════════════════╝

              Master English with Expert Courses
    From beginner to advanced. All courses include NFT certificates
         verified on blockchain.

    ✅ Free Courses  🎓 NFT Certificates  ⚡ API Integration  ⛽ Gasless

╔══════════════════════════════════════════════════════════════════╗
║  Filter by Level                                                 ║
║  [All Levels] [A1] [B2] [B2] [B2] [C1]                          ║
╚══════════════════════════════════════════════════════════════════╝

Available Courses (6)                     🔗 Powered by API Integration

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│       🌱        │  │       🌿        │  │       🌳        │
│      [A1]       │  │      [A2]       │  │      [B1]       │
│                 │  │                 │  │                 │
│ English for     │  │ Elementary      │  │ Intermediate    │
│ Beginners (A1)  │  │ English (A2)    │  │ English (B1)    │
│                 │  │                 │  │                 │
│ Start your...   │  │ Build on...     │  │ Develop...      │
│                 │  │                 │  │                 │
│ 👨‍🏫 Sarah      │  │ 👨‍🏫 Michael   │  │ 👨‍🏫 Emma      │
│                 │  │                 │  │                 │
│ 📚 24  ⏱️ 6w   │  │ 📚 32  ⏱️ 8w   │  │ 📚 40  ⏱️ 10w  │
│ ⭐ 4.8         │  │ ⭐ 4.9         │  │ ⭐ 4.7         │
│                 │  │                 │  │                 │
│ [Alphabet]      │  │ [Past Tenses]   │  │ [Complex]       │
│ [Grammar] +2    │  │ [Comparisons]   │  │ [Idiomatic] +2  │
│                 │  │                 │  │                 │
│ 👥 1,523        │  │ 👥 1,205       │  │ 👥 987         │
│ 🎓 Certificate  │  │ 🎓 Certificate  │  │ 🎓 Certificate  │
│                 │  │                 │  │                 │
│ [Enroll • Free] │  │ [Enroll • Free] │  │ [Enroll • Free] │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│       🌲        │  │       🏆        │  │       💼        │
│      [B2]       │  │      [C1]       │  │    [B2-C1]      │
│                 │  │                 │  │                 │
│ Upper-Inter...  │  │ Advanced...     │  │ Business...     │
│     (продолжение курсов)                                  │
└─────────────────┘  └─────────────────┘  └─────────────────┘

╔══════════════════════════════════════════════════════════════════╗
║                    Platform Statistics                           ║
║  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                            ║
║  │  6  │  │5,797│  │4.8★ │  │100% │                            ║
║  │Active│  │Total│  │Avg  │  │Get  │                            ║
║  │Cours│  │Stud │  │Rate │  │Cert │                            ║
║  └─────┘  └─────┘  └─────┘  └─────┘                            ║
╚══════════════════════════════════════════════════════════════════╝
```

### 2. API Demo Mode (кнопка "API Demo")

```
╔══════════════════════════════════════════════════════════════════╗
║               API Integration Demo                               ║
║  This page demonstrates how the frontend integrates with our     ║
║  English courses API                                             ║
╚══════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════╗
║  🔗 API Endpoint                                                 ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ GET /api/english-courses                                 │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║  Query Parameters:                                               ║
║  • level - Filter by CEFR level (A1, A2, B1, B2, C1)           ║
╚══════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════╗
║  ⚡ Live API Call Example                                        ║
║                                                                  ║
║  Try it: Select a level to filter courses                       ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ [All Levels ▼]                                           │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  Request URL:                                                    ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ /api/english-courses                                     │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  Response:                                                       ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ {                                                        │   ║
║  │   "success": true,                                       │   ║
║  │   "count": 6,                                            │   ║
║  │   "courses": [                                           │   ║
║  │     {                                                    │   ║
║  │       "id": "beginner-english-a1",                       │   ║
║  │       "title": "English for Beginners (A1)",             │   ║
║  │       "level": "A1",                                     │   ║
║  │       ...                                                │   ║
║  │     }                                                    │   ║
║  │   ]                                                      │   ║
║  │ }                                                        │   ║
║  └──────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════╗
║  💻 Frontend Integration Code                                    ║
║                                                                  ║
║  React/Next.js Example:                                          ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ const fetchCourses = async (level?: string) => {         │   ║
║  │   const url = level                                      │   ║
║  │     ? `/api/english-courses?level=${level}`              │   ║
║  │     : '/api/english-courses';                            │   ║
║  │                                                          │   ║
║  │   const response = await fetch(url);                     │   ║
║  │   const data = await response.json();                    │   ║
║  │   ...                                                    │   ║
║  │ };                                                       │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ✨ Key Features:                                                ║
║  ✓ RESTful API design                                           ║
║  ✓ Level-based filtering                                        ║
║  ✓ Real-time data fetching                                      ║
║  ✓ JSON response format                                         ║
║  ✓ Easy to integrate with any frontend                          ║
╚══════════════════════════════════════════════════════════════════╝
```

### 3. Детальная страница курса: `/english-demo/beginner-english-a1`

```
╔══════════════════════════════════════════════════════════════════╗
║  ← Back to Courses                              [Home] [👤]      ║
╚══════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════╗
║  [A1] 🎓 Certificate Included                                    ║
║                                                                  ║
║  English for Beginners (A1)                                      ║
║                                                                  ║
║  Start your English learning journey. Learn basic grammar,       ║
║  vocabulary, and everyday phrases.                               ║
║                                                                  ║
║  ⭐ 4.8 (342 reviews)  👥 1,523 students  📚 24 lessons  ⏱️ 6w   ║
╚══════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────┐  ┌──────────────────────┐
│ What You'll Learn                    │  │        Free          │
│                                      │  │  Full lifetime access│
│ ✓ Understand and use basic English  │  │                      │
│ ✓ Introduce yourself and others     │  │  [Connect Wallet]    │
│ ✓ Ask and answer simple questions   │  │  или                 │
│ ✓ Interact in a simple way          │  │  [Enroll Now]        │
│                                      │  │                      │
├─────────────────────────────────────┤  ├──────────────────────┤
│ Course Content                       │  │ Lessons: 24          │
│                                      │  │ Duration: 6 weeks    │
│ ▼ Week 1-2: The Basics              │  │ Level: A1            │
│   📖 Alphabet & Sounds               │  │ Students: 1,523      │
│   📖 Greetings                       │  │ Certificate: Yes ✓   │
│   📖 Basic Verbs                     │  │                      │
│   📖 Numbers 1-100                   │  ├──────────────────────┤
│                                      │  │ This course includes:│
│ ▼ Week 3-4: Building Blocks         │  │ ✓ Lifetime access    │
│   📖 Present Simple                  │  │ ✓ NFT Certificate    │
│   📖 Questions                       │  │ ✓ Blockchain verified│
│   📖 Common Nouns                    │  │ ✓ Gasless minting    │
│   📖 Daily Routines                  │  └──────────────────────┘
│                                      │
│ ▼ Week 5-6: Practical English       │
│   📖 Shopping                        │
│   📖 Directions                      │
│   📖 Food & Drinks                   │
│   📖 Family & Friends                │
│                                      │
├─────────────────────────────────────┤
│ Requirements                         │
│ • No prior knowledge needed          │
│ • Internet connection                │
│ • Dedication to practice             │
│                                      │
├─────────────────────────────────────┤
│ Instructor                           │
│ 👩‍🏫 Sarah Johnson                    │
│ TESOL certified with 10+ years of    │
│ teaching experience                  │
└─────────────────────────────────────┘
```

## 🎨 Color Scheme

### Level Badges
- 🌱 A1: `bg-green-100 text-green-800` (Beginner)
- 🌿 A2: `bg-blue-100 text-blue-800` (Elementary)
- 🌳 B1: `bg-yellow-100 text-yellow-800` (Intermediate)
- 🌲 B2: `bg-orange-100 text-orange-800` (Upper-Intermediate)
- 🏆 C1: `bg-red-100 text-red-800` (Advanced)
- 💼 Business: `bg-purple-100 text-purple-800` (Professional)

### Gradients
- Headers: `from-blue-500 to-indigo-600`
- Buttons: `from-blue-500 to-indigo-600`
- Background: `from-blue-50 via-indigo-50 to-purple-50`

### UI Elements
- Cards: White with shadow-lg
- Hover: `transform hover:-translate-y-1`
- Active: Blue gradient
- Disabled: `opacity-50`

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
├── Single column
├── Stacked navigation
└── Full-width cards

Tablet (768px - 1024px):
├── 2 column grid
├── Compact navigation
└── Medium cards

Desktop (> 1024px):
├── 3 column grid
├── Full navigation
└── Large cards with hover effects
```

## ⚡ Interactive Elements

### Hover Effects
- Cards: Поднятие + увеличение тени
- Buttons: Изменение градиента
- Links: Изменение цвета
- Level badges: Легкое свечение

### Click Actions
- Card → Navigate to detail page
- Enroll Button → Connect wallet (if needed) → API call
- Filter Button → Fetch filtered courses
- API Demo Toggle → Switch view mode

### Loading States
- Courses loading: Spinner с текстом
- Enrolling: Button disabled + "Enrolling..."
- API Demo: Real-time JSON update

### Toast Notifications
- Success: Зеленый тост с ✓
- Error: Красный тост с ✗
- Info: Синий тост с ℹ️

## 🎯 User Interactions

### Flow 1: Просмотр и запись на курс
```
1. Открыть /english-demo
2. [Optional] Выбрать фильтр уровня
3. Кликнуть на карточку курса
4. Просмотреть детали
5. Подключить кошелек (если не подключен)
6. Кликнуть "Enroll Now"
7. Подтверждение записи (Toast)
```

### Flow 2: Изучение API
```
1. Открыть /english-demo
2. Кликнуть "API Demo"
3. Прочитать документацию эндпоинта
4. Выбрать уровень в dropdown
5. Наблюдать изменение URL
6. Просмотреть JSON ответ
7. [Optional] Скопировать примеры кода
```

## 📊 Визуальная иерархия

```
Level 1: Navigation (Fixed top)
  └─ Logo, Links, Wallet Button

Level 2: Hero Section
  └─ Title, Description, Features

Level 3: Filter Bar
  └─ Level buttons

Level 4: Content Grid
  ├─ Course Cards (Main focus)
  │  ├─ Visual icon
  │  ├─ Title
  │  ├─ Details
  │  └─ CTA button
  └─ Statistics

Level 5: Footer (if added)
```

## 🎬 Анимации

### Entrance
- Fade in для карточек
- Slide up для заголовков
- Scale для кнопок

### Interaction
- Smooth hover transitions (200ms)
- Button ripple effect
- Card lift on hover

### Data Loading
- Skeleton loaders
- Fade in/out transitions
- Smooth height changes

## ✨ Финальный чеклист

При открытии `/english-demo` вы должны увидеть:

- ✅ Красивый gradient header
- ✅ 6 карточек курсов с emoji иконками
- ✅ Level badges разных цветов
- ✅ Кнопки фильтрации
- ✅ Hover эффекты на карточках
- ✅ Кнопку "API Demo" в навигации
- ✅ Статистику внизу страницы
- ✅ Responsive дизайн
- ✅ Toast уведомления при действиях
- ✅ Connect Wallet функционал

При клике на курс:
- ✅ Детальная страница с gradient header
- ✅ Sidebar с ценой и кнопкой записи
- ✅ Модули курса с уроками
- ✅ Информация о преподавателе

В режиме API Demo:
- ✅ Документация эндпоинтов
- ✅ Живой пример с dropdown
- ✅ Real-time JSON ответ
- ✅ Примеры кода

## 🚀 Готово!

Просто откройте браузер и перейдите на `http://localhost:3000/english-demo`

