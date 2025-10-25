# 📚 English Learning Platform - API Integration Demo

## Обзор

Это демонстрационный стендовый сайт, показывающий работу API интеграции для платформы курсов английского языка. Проект демонстрирует полный цикл от API эндпоинтов до UI компонентов.

## 🎯 Что было создано

### 1. API Эндпоинты (`/api/english-courses`)

#### **GET /api/english-courses**
Получение списка всех курсов английского языка
- **Query Parameters:** 
  - `level` (optional) - Фильтр по уровню (A1, A2, B1, B2, C1)
- **Response:**
```json
{
  "success": true,
  "count": 6,
  "courses": [...]
}
```

#### **GET /api/english-courses/[id]**
Получение детальной информации о конкретном курсе
- **URL Parameters:** `id` - ID курса
- **Response:**
```json
{
  "success": true,
  "course": {
    "id": "beginner-english-a1",
    "title": "English for Beginners (A1)",
    "modules": [...],
    "whatYouLearn": [...],
    ...
  }
}
```

#### **POST /api/english-courses/enroll**
Запись студента на курс
- **Body:**
```json
{
  "courseId": "beginner-english-a1",
  "studentAddress": "0x...",
  "studentName": "John Doe" (optional)
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "enrollment": {
    "enrollmentId": "enr_...",
    "courseId": "...",
    "enrolledAt": "2024-10-25T...",
    ...
  }
}
```

### 2. Компоненты UI

#### **EnglishCourseCard** (`/components/EnglishCourseCard.tsx`)
Карточка курса с информацией:
- Уровень CEFR (A1-C1)
- Название и описание
- Преподаватель
- Статистика (количество уроков, длительность, рейтинг)
- Темы курса
- Наличие сертификата

#### **Страницы:**

1. **`/english-demo`** - Главная страница демо
   - Список всех курсов
   - Фильтрация по уровню
   - Переключение между просмотром курсов и демо API
   - Статистика платформы
   
2. **`/english-demo/[id]`** - Детальная страница курса
   - Полная информация о курсе
   - Модули и уроки
   - Требования
   - Информация о преподавателе
   - Возможность записаться на курс

## 📖 Доступные курсы

1. **English for Beginners (A1)** - 6 недель, 24 урока
2. **Elementary English (A2)** - 8 недель, 32 урока
3. **Intermediate English (B1)** - 10 недель, 40 уроков
4. **Upper-Intermediate English (B2)** - 12 недель, 48 уроков
5. **Advanced English (C1)** - 14 недель, 56 уроков
6. **Business English Professional (B2-C1)** - 8 недель, 32 уроков

## 🚀 Как запустить

### 1. Установка зависимостей (уже выполнено)
```bash
npm install
```

### 2. Запуск dev сервера
```bash
npm run dev
```

### 3. Открыть в браузере
```
http://localhost:3000/english-demo
```

## 💡 Демонстрация API интеграции

На странице `/english-demo` есть кнопка **"API Demo"**, которая показывает:

1. **Эндпоинт API** - URL и query параметры
2. **Живой пример** - возможность выбрать уровень и увидеть:
   - URL запроса
   - JSON ответ от API
3. **Код интеграции** - примеры кода на React/Next.js
4. **Ключевые особенности** - преимущества API

## 🎨 Особенности UI

- 🎨 Современный градиентный дизайн
- 📱 Адаптивная верстка (мобильные, планшеты, десктопы)
- ⚡ Плавные анимации и переходы
- 🔄 Real-time фильтрация
- 🎯 Интуитивная навигация
- 💫 Hover эффекты

## 🔗 Интеграция с blockchain

Каждый курс включает:
- ✅ NFT сертификат по завершению
- ⛽ Gasless minting (без газа для пользователя)
- 🔗 Верификация на Status Network
- 🎓 Постоянное подтверждение достижений

## 📊 API Response Examples

### Список курсов
```javascript
// Запрос
fetch('/api/english-courses')

// Ответ
{
  "success": true,
  "count": 6,
  "courses": [
    {
      "id": "beginner-english-a1",
      "title": "English for Beginners (A1)",
      "level": "A1",
      "duration": "6 weeks",
      "lessons": 24,
      "students": 1523,
      "rating": 4.8,
      "instructor": "Sarah Johnson",
      "certificate": true
    }
  ]
}
```

### Фильтрация по уровню
```javascript
// Запрос
fetch('/api/english-courses?level=B1')

// Ответ возвращает только курсы уровня B1
```

### Запись на курс
```javascript
// Запрос
fetch('/api/english-courses/enroll', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseId: 'beginner-english-a1',
    studentAddress: '0x123...',
  })
})

// Ответ
{
  "success": true,
  "enrollment": {
    "enrollmentId": "enr_1729831456789",
    "courseId": "beginner-english-a1",
    "studentAddress": "0x123...",
    "enrolledAt": "2024-10-25T04:30:56.789Z",
    "progress": 0,
    "status": "active"
  }
}
```

## 🎯 Навигация

Демо-страница доступна из главной навигации:
- В верхнем меню есть ссылка **"📚 English Demo"**
- Или прямой переход на `/english-demo`

## 🛠️ Технологический стек

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Blockchain:** Wagmi, RainbowKit, ethers.js
- **API:** Next.js API Routes
- **Notifications:** react-hot-toast

## ✨ Ключевые особенности демо

1. **RESTful API** - стандартные HTTP методы
2. **JSON Response** - структурированные данные
3. **Level Filtering** - фильтрация по уровню CEFR
4. **Real-time Updates** - мгновенное обновление UI
5. **Wallet Integration** - подключение через RainbowKit
6. **Toast Notifications** - уведомления о действиях
7. **Responsive Design** - работает на всех устройствах
8. **Loading States** - индикаторы загрузки

## 📝 Примеры использования

### Интеграция в существующий проект

```javascript
// 1. Получить все курсы
const getCourses = async () => {
  const res = await fetch('/api/english-courses');
  const data = await res.json();
  return data.courses;
};

// 2. Фильтровать по уровню
const getB1Courses = async () => {
  const res = await fetch('/api/english-courses?level=B1');
  const data = await res.json();
  return data.courses;
};

// 3. Записаться на курс
const enrollInCourse = async (courseId, walletAddress) => {
  const res = await fetch('/api/english-courses/enroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      courseId, 
      studentAddress: walletAddress 
    })
  });
  return await res.json();
};
```

## 🎓 Заключение

Этот демо-сайт показывает полную интеграцию API для образовательной платформы с blockchain сертификатами. Все API эндпоинты готовы к использованию и могут быть легко адаптированы под реальные требования проекта.

