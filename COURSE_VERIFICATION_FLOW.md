# 📚 Полный Flow: Создание курса и верификация

## 🎯 Обзор

Этот документ описывает полный пользовательский сценарий создания курса, отправки на верификацию и получения NFT сертификата с двумя возможными исходами: **успешная верификация** и **отказ в верификации**.

---

## 🚀 Сценарий 1: Полный успешный путь

### Шаг 1: Создание курса

**Страница:** `/create-course`

1. Пользователь подключает кошелек
2. Заполняет информацию о курсе:
   - **Название** (минимум 5 символов)
   - **Описание** (минимум 20 символов)
   - **Длительность** (опционально)
3. Добавляет уроки (минимум 3 урока для сертификации):
   - **Название урока** (минимум 3 символа)
   - **Описание урока** (опционально)
   - **Контент урока** (минимум 50 символов)
4. Нажимает "Create Course"

**Валидация:**
- ✅ Название курса >= 5 символов
- ✅ Описание >= 20 символов  
- ✅ Минимум 3 урока
- ✅ Каждый урок с названием >= 3 символа
- ✅ Каждый урок с контентом >= 50 символов

**Результат:**
```json
{
  "success": true,
  "course": {
    "id": "course_1729831456789",
    "title": "Introduction to Web3",
    "status": "draft",
    "createdAt": "2024-10-25T..."
  }
}
```

**Уведомления:**
- 🎉 "Course created successfully!"
- 💡 "Next step: Submit for verification to get your NFT certificate!"

**Переход:** Автоматический редирект на `/my-courses`

---

### Шаг 2: Просмотр курса и отправка на верификацию

**Страница:** `/my-courses`

**Что видит пользователь:**
- Карточка курса со статусом "📝 Draft"
- Синий информационный блок: "💡 Ready to get your certificate? Submit for verification!"
- Кнопка "Submit for Verification →"

**Действие:** Клик на "Submit for Verification"

**Модальное окно "Submit for Verification":**
- Название курса
- Информация о процессе верификации:
  - ✓ Admin will review your course content
  - ✓ Verification usually takes 24-48 hours
  - ✓ Upon approval, you'll receive an NFT certificate
  - ✓ Certificate minting is gasless!
- Поле "Proof of Completion" (минимум 50 символов)
- Кнопки: "Cancel" | "Submit for Verification"

**Валидация:**
- ✅ Proof of completion >= 50 символов

**API запрос:**
```javascript
POST /api/courses/submit-verification
{
  "courseId": "course_123",
  "studentAddress": "0x...",
  "proofOfCompletion": "I completed all lessons..."
}
```

**Результат:**
```json
{
  "success": true,
  "message": "Course submitted for verification",
  "verificationRequest": {
    "id": "req_1729831456789",
    "status": "pending",
    "submittedAt": "2024-10-25T..."
  }
}
```

**Уведомления:**
- ✅ "Course submitted for verification!"
- 💬 "You'll be notified when verification is complete"

**Обновление UI:**
- Статус курса меняется на "⏳ Pending"
- Желтый блок: "Under Review - Your course is being verified by our team"
- Показывается дата отправки

---

### Шаг 3A: Админ верифицирует курс (Успешный сценарий)

**Страница:** `/verification` (Admin Panel)

**Что видит админ:**
- Список pending запросов
- Карточка запроса с информацией:
  - Название курса и описание
  - Адрес студента
  - Количество уроков
  - Дата отправки
  - Proof of completion
- Кнопка "👁️ Review Details"

**Действие:** Клик на "Review Details"

**Модальное окно "Review Course Completion":**
- Детальная информация о курсе
- Информация о студенте
- Proof of completion
- Что произойдет дальше (информация о минтинге NFT)
- Кнопки: "❌ Reject Request" | "✅ Verify & Issue Certificate"

**Действие:** Клик на "✅ Verify & Issue Certificate"

**API запрос:**
```javascript
POST /api/verification/verify
{
  "requestId": "req_123",
  "verifierAddress": "0x...",
  "status": "verified"
}
```

**Результат:**
```json
{
  "success": true,
  "message": "Course verified successfully. NFT certificate will be minted.",
  "verification": {
    "status": "verified",
    "verifiedAt": "2024-10-25T...",
    "nftMintStatus": "pending"
  }
}
```

**Уведомления (Админ):**
- ✅ "Course verified! NFT certificate will be minted."
- 💬 "Student 0x1234...5678 will receive their certificate"

---

### Шаг 4A: Студент видит результат (Успешный)

**Страница:** `/my-courses`

**Что видит студент:**
- Статус курса: "✅ Verified"
- Зеленый блок:
  - "✅ Verified!"
  - "Your course has been approved"
  - Дата верификации
- Кнопка "🎓 Claim NFT Certificate"

**Действие:** Клик на "Claim NFT Certificate"

**Результат:**
- Редирект на `/my-certificates`
- NFT сертификат минтится (gasless)
- Сертификат добавляется в коллекцию пользователя

**Уведомление:**
- 🎓 "Claiming NFT certificate for: [Course Name]"

---

## ❌ Сценарий 2: Отказ в верификации

### Шаг 3B: Админ отклоняет курс

**Страница:** `/verification` (Admin Panel)

**Действие в модальном окне:** Клик на "❌ Reject Request"

**Модальное окно "Reject Verification Request":**
- Заголовок: "Reject Verification Request"
- Подзаголовок: "Provide detailed feedback to help the student improve"
- Поле "Rejection Reason" (минимум 10 символов)
- Предупреждение: "⚠️ Important: The student will receive this feedback and can resubmit after making improvements."
- Кнопки: "Cancel" | "Confirm Rejection"

**Валидация:**
- ✅ Rejection reason >= 10 символов
- ✅ Должен быть конструктивным и конкретным

**Пример причины отказа:**
```
"Course content is too basic and lacks sufficient depth. 
Please add more advanced topics, practical examples, and 
at least 2 more lessons covering intermediate concepts. 
Also include code examples and exercises for each lesson."
```

**API запрос:**
```javascript
POST /api/verification/verify
{
  "requestId": "req_123",
  "verifierAddress": "0x...",
  "status": "rejected",
  "reason": "Course content is too basic..."
}
```

**Результат:**
```json
{
  "success": true,
  "message": "Request rejected. Student has been notified.",
  "verification": {
    "status": "rejected",
    "rejectedAt": "2024-10-25T...",
    "rejectionReason": "Course content is too basic..."
  }
}
```

**Уведомления (Админ):**
- ✅ "Request rejected. Student has been notified."

---

### Шаг 4B: Студент видит результат (Отказ)

**Страница:** `/my-courses`

**Что видит студент:**
- Статус курса: "❌ Rejected"
- Красный блок:
  - "❌ Verification Rejected"
  - **"Reason:"** [Детальная причина от админа]
  - Дата отклонения
- Кнопка "📝 Review & Resubmit"

**Пример отображения:**
```
┌─────────────────────────────────────────┐
│ ❌ Verification Rejected                │
│                                         │
│ Reason: Course content is too basic    │
│ and lacks sufficient depth. Please add │
│ more advanced topics, practical        │
│ examples, and at least 2 more lessons  │
│ covering intermediate concepts. Also   │
│ include code examples and exercises    │
│ for each lesson.                       │
│                                         │
│ Rejected: October 18, 2024             │
└─────────────────────────────────────────┘

       [📝 Review & Resubmit]
```

**Действие:** Клик на "Review & Resubmit"

**Результат:**
- Открывается модальное окно "Submit for Verification"
- Пользователь может обновить "Proof of Completion"
- Информационное уведомление: "Please review the feedback and resubmit after making improvements"

**Повторная отправка:**
- Студент исправляет курс (добавляет уроки, улучшает контент)
- Заполняет обновленный "Proof of Completion"
- Отправляет заново

**Цикл повторяется до успешной верификации**

---

## 📊 Статусы курса

| Статус | Badge | Описание | Доступные действия |
|--------|-------|----------|-------------------|
| **Draft** | 📝 Draft | Курс создан, но не отправлен | Submit for Verification |
| **Submitted** | ⏳ Pending | Ожидает верификации | Нет (ждем админа) |
| **Verified** | ✅ Verified | Успешно верифицирован | Claim NFT Certificate |
| **Rejected** | ❌ Rejected | Отклонен с причиной | Review & Resubmit |

---

## 🎨 UI/UX Особенности

### Цветовое кодирование:

- **Draft (Серый):** `bg-gray-100 text-gray-800`
- **Submitted (Желтый):** `bg-yellow-100 text-yellow-800`
- **Verified (Зеленый):** `bg-green-100 text-green-800`
- **Rejected (Красный):** `bg-red-100 text-red-800`

### Градиенты для кнопок:

- **Submit:** `from-blue-500 to-indigo-600`
- **Verify:** `from-green-500 to-emerald-600`
- **Reject:** `from-red-500 to-pink-600`
- **Resubmit:** `from-orange-500 to-red-600`

### Уведомления (Toast):

- ✅ **Success:** Зеленый тост
- ❌ **Error:** Красный тост
- ⏳ **Loading:** Синий тост с анимацией
- 💬 **Info:** Голубой тост

---

## 🔄 Полная диаграмма flow

```
┌─────────────┐
│   START     │
│ Connect     │
│  Wallet     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Create    │
│   Course    │
│ /create-    │
│  course     │
└──────┬──────┘
       │
       ▼ (Status: draft)
┌─────────────┐
│ My Courses  │
│ /my-courses │
│             │
│ [Submit for │
│ Verif]      │
└──────┬──────┘
       │
       ▼ (Status: submitted)
┌─────────────┐
│   Waiting   │
│     for     │
│   Admin     │
│  Review     │
└──────┬──────┘
       │
       ├───────────┐
       │           │
       ▼           ▼
┌──────────┐  ┌──────────┐
│  VERIFY  │  │  REJECT  │
│  (Admin) │  │  (Admin) │
└────┬─────┘  └────┬─────┘
     │             │
     ▼             ▼
(Status:      (Status:
 verified)     rejected)
     │             │
     ▼             │
┌──────────┐      │
│  Claim   │      │
│   NFT    │      │
│   Cert   │      │
└──────────┘      │
     │             │
     ▼             ▼
   SUCCESS    ┌──────────┐
   🎓 END     │  Review  │
              │   &      │
              │ Resubmit │
              └────┬─────┘
                   │
                   └─────┐
                         │
                (Back to submit)
```

---

## 🧪 Тестовые данные

### Демо-курсы в системе:

1. **Draft:**
   - Title: "Introduction to Web3 Development"
   - Status: draft
   - Action: Can submit

2. **Submitted:**
   - Title: "Smart Contract Security"
   - Status: submitted
   - Waiting for review

3. **Verified:**
   - Title: "DeFi Protocols Explained"
   - Status: verified
   - Action: Claim certificate

4. **Rejected:**
   - Title: "Basic Solidity Programming"
   - Status: rejected
   - Reason: "Course content is too basic..."
   - Action: Review & resubmit

---

## 📝 Валидация и требования

### Создание курса:
- ✅ Название: >= 5 символов
- ✅ Описание: >= 20 символов
- ✅ Уроков: >= 3 для сертификации
- ✅ Название урока: >= 3 символа
- ✅ Контент урока: >= 50 символов

### Отправка на верификацию:
- ✅ Proof of completion: >= 50 символов

### Отказ в верификации:
- ✅ Rejection reason: >= 10 символов
- ✅ Должна быть конкретной и конструктивной

---

## 🎯 Ключевые моменты UX

1. **Прозрачность:** Пользователь всегда знает текущий статус
2. **Feedback:** Детальная причина при отказе
3. **Guidance:** Информационные блоки с подсказками
4. **Validation:** Валидация на каждом шаге
5. **Notifications:** Toast уведомления о всех действиях
6. **Reassurance:** Напоминание о gasless minting
7. **Recovery:** Возможность исправить и переотправить

---

## 🚀 Запуск демонстрации

```bash
# Запустите dev сервер (порт 3002)
npm run dev

# Откройте браузер
http://localhost:3002

# Подключите кошелек

# Пройдите весь flow:
1. Dashboard → Create Course
2. Create Course → Add lessons → Create
3. My Courses → Submit for Verification
4. Verification (Admin) → Review → Verify/Reject
5. My Courses → See result → Claim/Resubmit
```

---

## ✨ Готово!

Полный пользовательский flow с двумя сценариями реализован и готов к демонстрации! 🎉

