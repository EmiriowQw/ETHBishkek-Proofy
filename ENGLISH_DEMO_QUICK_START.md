# 🚀 Быстрый старт - English Learning Platform Demo

## ✅ Что было создано

Полноценный демонстрационный сайт курсов английского языка с API интеграцией!

## 📁 Созданные файлы

### API Эндпоинты:
1. `pages/api/english-courses/index.ts` - Список курсов + фильтрация
2. `pages/api/english-courses/[id].ts` - Детальная информация о курсе
3. `pages/api/english-courses/enroll.ts` - Запись на курс

### UI Компоненты:
1. `components/EnglishCourseCard.tsx` - Карточка курса
2. `pages/english-demo.tsx` - Главная страница с курсами + API Demo
3. `pages/english-demo/[id].tsx` - Детальная страница курса

### Документация:
1. `ENGLISH_DEMO_README.md` - Полная документация
2. `ENGLISH_DEMO_QUICK_START.md` - Этот файл

## 🎯 Как посмотреть демо

### 1. Если сервер НЕ запущен:
```bash
npm run dev
```

### 2. Откройте в браузере:
```
http://localhost:3000/english-demo
```

### 3. Или через главную страницу:
```
http://localhost:3000
```
Затем нажмите на **"📚 English Demo"** в верхнем меню

## 🎨 Что вы увидите

### Главная страница `/english-demo`:
- ✅ 6 курсов английского языка (A1 → C1 + Business)
- ✅ Фильтрация по уровням
- ✅ Красивые карточки курсов
- ✅ Статистика платформы
- ✅ Переключение в режим "API Demo"

### Режим API Demo (кнопка "API Demo"):
- 🔗 URL эндпоинта API
- ⚡ Живой пример с фильтрацией
- 📊 Отображение JSON ответа в реальном времени
- 💻 Примеры кода интеграции
- ✨ Ключевые особенности API

### Детальная страница курса:
- 📚 Полная информация о курсе
- 🎯 Что вы изучите
- 📖 Содержание курса (модули + уроки)
- 👨‍🏫 Информация о преподавателе
- 💳 Возможность записаться (с подключением кошелька)

## 🎓 Доступные курсы

| Уровень | Курс | Уроков | Длительность |
|---------|------|--------|--------------|
| 🌱 A1 | English for Beginners | 24 | 6 недель |
| 🌿 A2 | Elementary English | 32 | 8 недель |
| 🌳 B1 | Intermediate English | 40 | 10 недель |
| 🌲 B2 | Upper-Intermediate English | 48 | 12 недель |
| 🏆 C1 | Advanced English | 56 | 14 недель |
| 💼 B2-C1 | Business English Professional | 32 | 8 недель |

## 🧪 Тестирование API

### Через браузер:

1. **Все курсы:**
```
http://localhost:3000/api/english-courses
```

2. **Фильтр по уровню B1:**
```
http://localhost:3000/api/english-courses?level=B1
```

3. **Детали курса:**
```
http://localhost:3000/api/english-courses/beginner-english-a1
```

### Через код (в консоли браузера):

```javascript
// Получить все курсы
fetch('/api/english-courses')
  .then(r => r.json())
  .then(console.log);

// Фильтр по уровню
fetch('/api/english-courses?level=B1')
  .then(r => r.json())
  .then(console.log);

// Записаться на курс
fetch('/api/english-courses/enroll', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseId: 'beginner-english-a1',
    studentAddress: '0x123...'
  })
})
  .then(r => r.json())
  .then(console.log);
```

## 🎯 Основные возможности

### ✅ Реализовано:

- [x] RESTful API эндпоинты
- [x] GET запросы для получения курсов
- [x] POST запрос для записи
- [x] Фильтрация по уровням CEFR
- [x] Красивый UI с градиентами
- [x] Адаптивный дизайн
- [x] Карточки курсов
- [x] Детальные страницы
- [x] Демонстрация API интеграции
- [x] Интеграция с Web3 кошельками
- [x] Toast уведомления
- [x] Loading состояния
- [x] Hover эффекты

## 💡 Особенности демо

1. **API Integration** - Демонстрирует работу API в реальном времени
2. **Level Filtering** - Фильтрация по уровням CEFR (A1-C1)
3. **Responsive Design** - Работает на мобильных, планшетах, десктопах
4. **Modern UI** - Градиенты, тени, анимации
5. **Web3 Ready** - Интеграция с кошельками через RainbowKit
6. **NFT Certificates** - Каждый курс включает blockchain сертификат

## 🔗 Навигация

Из любого места сайта:
- Главная: `/` → Кнопка "📚 English Demo"
- Напрямую: `/english-demo`
- API Demo: `/english-demo` → Кнопка "API Demo"
- Детали курса: Клик на любую карточку

## 📊 Структура API Response

```json
{
  "success": true,
  "count": 6,
  "courses": [
    {
      "id": "beginner-english-a1",
      "title": "English for Beginners (A1)",
      "level": "A1",
      "description": "...",
      "duration": "6 weeks",
      "lessons": 24,
      "students": 1523,
      "rating": 4.8,
      "instructor": "Sarah Johnson",
      "price": "Free",
      "topics": ["...", "..."],
      "image": "🌱",
      "certificate": true
    }
  ]
}
```

## 🎉 Готово!

Демо-сайт полностью готов к демонстрации. Просто откройте браузер и перейдите на:

```
http://localhost:3000/english-demo
```

Наслаждайтесь! 🚀

