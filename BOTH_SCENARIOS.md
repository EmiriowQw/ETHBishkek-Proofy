# 🎯 TWO SCENARIOS IMPLEMENTATION

## ✅ Проект поддерживает ОБА сценария!

---

## 📋 Сценарий 1: Внешняя интеграция (для платформ курсов)

### Описание:
Платформа курсов интегрирует наш API. Пользователь завершает курс на их сайте → **автоматически получает NFT** (без ручной верификации).

### User Flow:
```
1. Пользователь проходит курс на внешней платформе
   ↓
2. Завершает курс
   ↓
3. Платформа вызывает наш API
   ↓
4. NFT автоматически mint'ится (gasless!)
   ↓
5. Сертификат сразу в кошельке пользователя
```

### Как это работает:

#### Для платформ курсов:

**1. Получить API ключ:**
```
- Подключить кошелек на proofy.io
- Открыть "API Integration"
- Сгенерировать API ключ
```

**2. Интегрировать endpoint:**
```javascript
POST https://api.proofy.io/v1/certificates/mint

Headers:
- Content-Type: application/json
- Authorization: Bearer YOUR_API_KEY

Body:
{
  "studentAddress": "0x...",
  "courseName": "Web3 Development",
  "courseId": "web3-dev-101",
  "studentName": "John Doe",
  "completionDate": "2024-10-24"
}

Response:
{
  "success": true,
  "tokenId": "1234",
  "tokenURI": "ipfs://...",
  "txHash": "0x...",
  "gasless": true,
  "network": "Status Sepolia"
}
```

**3. Вызывать при завершении курса:**
```javascript
// В вашем backend при завершении курса
async function onCourseCompletion(userId, courseId) {
  const user = await getUser(userId);
  const course = await getCourse(courseId);
  
  // Вызов Proofy API
  const response = await fetch('https://api.proofy.io/v1/certificates/mint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PROOFY_API_KEY}`
    },
    body: JSON.stringify({
      studentAddress: user.walletAddress,
      courseName: course.name,
      courseId: course.id,
      studentName: user.name,
      completionDate: new Date().toISOString()
    })
  });
  
  const certificate = await response.json();
  
  // NFT мгновенно создан!
  console.log('Certificate minted:', certificate.tokenId);
}
```

### Преимущества:
- ✅ **Автоматически** - без ручной верификации
- ✅ **Мгновенно** - NFT сразу после завершения
- ✅ **Gasless** - пользователь не платит газ
- ✅ **Просто** - один API вызов
- ✅ **Масштабируемо** - для любого количества пользователей

---

## 📝 Сценарий 2: Ручная верификация (для индивидуальных пользователей)

### Описание:
Пользователь создает курс на нашем сайте → отправляет на верификацию → **админ проверяет** → одобряет → NFT выдается.

### User Flow:
```
1. Пользователь создает курс на proofy.io
   ↓
2. Добавляет уроки и контент
   ↓
3. Отправляет на верификацию (Submit for Verification)
   ↓
4. Админ проверяет курс в разделе "Verification"
   ↓
5. Админ одобряет (Verify) или отклоняет (Reject)
   ↓
6. Если одобрено → NFT автоматически mint'ится
   ↓
7. Пользователь забирает сертификат (Claim Certificate)
```

### Как это работает:

#### Для пользователей:

**1. Создать курс:**
```
- Подключить кошелек
- Dashboard → "Create New Course"
- Заполнить информацию о курсе
- Добавить уроки (минимум 1)
- Нажать "Create Course"
```

**2. Отправить на верификацию:**
```
- "My Courses" → найти курс
- Статус: "Draft"
- Нажать "Submit for Verification"
- Статус изменится на "Pending Verification"
```

**3. Дождаться одобрения:**
```
- Админ проверяет курс (24-48 часов)
- Получаете уведомление о результате
- Если одобрено → статус "Verified"
```

**4. Забрать NFT:**
```
- "My Courses" → найти верифицированный курс
- Нажать "Claim NFT Certificate"
- NFT автоматически отправляется в ваш кошелек
```

#### Для верификаторов/админов:

**1. Открыть заявки:**
```
- "Verification Requests"
- Список всех pending заявок
```

**2. Проверить курс:**
```
- Нажать "Review" на заявке
- Проверить:
  - Название курса
  - Описание
  - Количество уроков
  - Качество контента
```

**3. Принять решение:**
```
- "Verify & Issue Certificate" ✅
  → NFT автоматически mint'ится
  → Пользователь получает сертификат
  
- "Reject" ❌
  → Пользователь может исправить и отправить снова
```

### Преимущества:
- ✅ **Качество** - проверка контента админом
- ✅ **Гибкость** - создание любых курсов
- ✅ **Контроль** - фильтрация спама
- ✅ **Gasless** - пользователь не платит газ
- ✅ **Прозрачность** - понятный процесс верификации

---

## 🔄 Сравнение сценариев:

| Параметр | Сценарий 1 (API) | Сценарий 2 (Manual) |
|----------|------------------|---------------------|
| **Кто использует** | Платформы курсов | Индивидуальные пользователи |
| **Создание курса** | На внешней платформе | На proofy.io |
| **Верификация** | Не требуется | Требуется (админ) |
| **Скорость** | Мгновенно | 24-48 часов |
| **Газ** | Gasless ✅ | Gasless ✅ |
| **Автоматизация** | Полная | Частичная |
| **Контроль качества** | Платформа курсов | Админы Proofy |
| **Масштабируемость** | Очень высокая | Средняя |

---

## 🎯 Какой сценарий выбрать?

### Используйте Сценарий 1 (API), если:
- ✅ Вы платформа онлайн-курсов
- ✅ Нужна автоматизация для множества пользователей
- ✅ Хотите мгновенную выдачу сертификатов
- ✅ Сами контролируете качество курсов
- ✅ Нужна интеграция в существующую систему

### Используйте Сценарий 2 (Manual), если:
- ✅ Вы индивидуальный преподаватель/эксперт
- ✅ Создаете уникальный авторский курс
- ✅ Хотите верификацию от Proofy
- ✅ Нужна платформа для создания курса
- ✅ Готовы подождать проверку

---

## 🔌 Endpoints:

### API Integration (Scenario 1):
```
POST /v1/certificates/mint
- Требует API ключ
- Автоматический mint
- Без верификации
```

### Manual Verification (Scenario 2):
```
POST /api/courses/create
- Создание курса

POST /api/courses/submit
- Отправка на верификацию

GET /api/verification/requests
- Список заявок (для админов)

POST /api/verification/verify
- Одобрение/отклонение (для админов)

POST /api/certificates/mint
- Mint после верификации
```

---

## 🎨 UI для обоих сценариев:

### Dashboard:
```
┌─────────────────────────────────────┐
│  Proofy Dashboard                   │
├─────────────────────────────────────┤
│                                     │
│  [🔗 API Integration]               │
│  For course platforms               │
│  → View API Docs                    │
│                                     │
│  [✍️ Manual Creation]               │
│  For individual users               │
│  → Create Course                    │
│                                     │
└─────────────────────────────────────┘
```

### API Integration Page:
- Генерация API ключа
- Документация endpoint
- Примеры кода (JS, Python, etc.)
- Quick Start guide

### Manual Creation Flow:
- Create Course form
- My Courses list
- Verification Requests (admin)
- Certificate claiming

---

## ✅ Готово к использованию!

Проект поддерживает ОБА сценария:

1. **API Integration** ✅
   - Для платформ курсов
   - Автоматический mint
   - Мгновенная выдача

2. **Manual Verification** ✅
   - Для индивидуальных пользователей
   - Создание курсов
   - Проверка качества

---

## 🚀 Запуск:

```bash
# Backend (уже запущен)
cd backend
npm run dev

# Frontend
cd ..
npm run dev
```

Откройте: **http://localhost:3000**

---

**Оба сценария работают параллельно! Выбирайте что вам подходит!** 🎉

