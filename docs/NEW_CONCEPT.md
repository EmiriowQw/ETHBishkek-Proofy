# 🎓 NEW CONCEPT - Course Creation Platform

## 📝 Изменения в концепции проекта

### Было (старая концепция):
- Готовые курсы для прохождения
- Пользователь проходит курс → получает NFT

### Стало (новая концепция):
- **Пользователь СОЗДАЕТ свой курс**
- **Отправляет на верификацию**
- **После верификации получает NFT-сертификат**

---

## 🎯 Новый User Flow:

### 1. Создание курса
```
1. Подключить кошелек
2. Нажать "Create New Course"
3. Заполнить информацию:
   - Название курса
   - Описание
   - Длительность (опционально)
4. Добавить уроки:
   - Название урока
   - Описание
   - Контент урока
5. Сохранить курс (статус: Draft)
```

### 2. Отправка на верификацию
```
1. Открыть "My Courses"
2. Выбрать курс со статусом "Draft"
3. Нажать "Submit for Verification"
4. Курс отправляется администраторам
5. Статус: Pending Verification
```

### 3. Верификация (для администраторов)
```
1. Открыть "Verification Requests"
2. Просмотреть список заявок
3. Нажать "Review" на заявке
4. Проверить курс
5. Принять решение:
   ✅ Verify & Issue Certificate
   ❌ Reject
```

### 4. Получение NFT
```
1. После верификации статус = "Verified"
2. Открыть "My Courses"
3. Нажать "Claim NFT Certificate"
4. NFT автоматически mint'ится (gasless!)
5. Сертификат появляется в "My Certificates"
```

---

## 📱 Новые страницы:

### 1. `/` - Dashboard
- **Описание**: Главная страница с статистикой
- **Функции**:
  - Кнопка "Create New Course"
  - Статистика: курсы, ожидающие, верифицированные, NFT
  - Empty state для новых пользователей

### 2. `/create-course` - Создание курса
- **Описание**: Форма создания курса
- **Функции**:
  - Ввод информации о курсе
  - Добавление уроков
  - Редактирование/удаление уроков
  - Сохранение курса

### 3. `/my-courses` - Мои курсы
- **Описание**: Список созданных курсов
- **Функции**:
  - Просмотр всех курсов пользователя
  - Фильтрация по статусу
  - Кнопки действий по статусу:
    - Draft → "Submit for Verification"
    - Submitted → "Waiting..."
    - Verified → "Claim Certificate"
    - Rejected → "Resubmit"

### 4. `/verification` - Верификация (для админов)
- **Описание**: Проверка курсов
- **Функции**:
  - Список заявок на верификацию
  - Просмотр деталей курса
  - Кнопки "Verify" / "Reject"
  - Mint NFT при верификации

### 5. `/my-certificates` - Мои сертификаты
- **Описание**: NFT сертификаты
- **Функции**:
  - Просмотр полученных NFT
  - Детали сертификата
  - Ссылка на blockchain explorer

---

## 🔄 Статусы курса:

| Статус | Описание | Действия |
|--------|----------|----------|
| **draft** | Курс создан, но не отправлен | Submit for Verification |
| **submitted** | Отправлен на проверку | Ожидание ⏳ |
| **verified** | Курс верифицирован | Claim NFT Certificate 🎓 |
| **rejected** | Курс отклонен | Исправить и отправить снова |

---

## 🎨 UI Компоненты:

### Dashboard:
- Stats Cards (4 карточки со статистикой)
- Empty State (для новых пользователей)
- Create Course Button (CTA)

### Create Course Page:
- Course Information Form
- Lessons List
- Add Lesson Form (раскрывающаяся)
- Preview lessons

### My Courses:
- Course Cards с статусами
- Status Badges (Draft, Pending, Verified, Rejected)
- Action Buttons по статусам

### Verification Page:
- Verification Requests List
- Review Modal
- Verify/Reject Buttons

---

## 🔌 API Endpoints:

### Courses:
- `POST /api/courses/create` - Создать курс
- `GET /api/courses/my-courses?address=<addr>` - Мои курсы
- `POST /api/courses/submit` - Отправить на верификацию

### Verification:
- `GET /api/verification/requests` - Список заявок
- `POST /api/verification/verify` - Верифицировать/отклонить

### Certificates:
- `POST /api/certificates/mint` - Mint NFT (после верификации)
- `GET /api/certificates/user/<addr>` - Мои сертификаты

---

## 💾 Backend (Demo Mode):

В `backend/src/index-simple.ts`:

```typescript
// Mock storage
const mockCourses = [];
const mockVerificationRequests = [];

// Endpoints:
- Create course → добавляет в mockCourses
- My courses → фильтрует по creatorAddress
- Submit → создает verification request
- Verify → обновляет статус + mint NFT
```

---

## 🎯 Преимущества новой концепции:

1. **Креативность** - пользователи создают контент
2. **Качество** - верификация обеспечивает качество
3. **Децентрализация** - community-driven платформа
4. **Blockchain** - верифицированные достижения on-chain
5. **Gasless** - бесплатно для пользователей

---

## 🚀 Как использовать:

### Для студентов/создателей:
```bash
1. Подключить MetaMask
2. Создать курс (Dashboard → Create Course)
3. Добавить уроки (минимум 1)
4. Отправить на верификацию (My Courses)
5. Дождаться верификации
6. Получить NFT (Claim Certificate)
```

### Для верификаторов/админов:
```bash
1. Подключить MetaMask (admin wallet)
2. Открыть Verification Requests
3. Просмотреть заявки
4. Нажать Review
5. Verify ✅ или Reject ❌
6. NFT автоматически mint'ится при verify
```

---

## 📝 Типы данных:

### Course:
```typescript
{
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  lessonsCount: number;
  creatorAddress: string;
  status: "draft" | "submitted" | "verified" | "rejected";
  createdAt: Date;
  submittedAt?: Date;
  verifiedAt?: Date;
}
```

### Lesson:
```typescript
{
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
}
```

### VerificationRequest:
```typescript
{
  id: string;
  courseId: string;
  courseTitle: string;
  studentAddress: string;
  lessonsCount: number;
  submittedAt: Date;
  status: "pending" | "verified" | "rejected";
}
```

---

## ✅ Что готово:

- ✅ Dashboard с статистикой
- ✅ Create Course page
- ✅ My Courses page
- ✅ Verification page
- ✅ API endpoints (demo mode)
- ✅ Backend mock storage
- ✅ Все UI компоненты
- ✅ Статусы и flow

---

## 🎉 Готово к использованию!

Проект полностью переделан под новую концепцию:
- Создание курсов ✅
- Верификация ✅
- NFT-сертификаты ✅
- Gasless транзакции ✅

**Откройте http://localhost:3000 и создайте свой первый курс!** 🚀

