# 🎬 Демонстрационный сценарий Web3 курсов

## 🚀 Быстрый старт

```bash
npm run dev
# Откроется на http://localhost:3002
```

---

## 📋 Сценарий демонстрации (5-7 минут)

### 1️⃣ Создание курса (2 мин)

**URL:** `http://localhost:3002/create-course`

**Действия:**
1. ✅ Подключить кошелек (RainbowKit)
2. ✅ Ввести название: "Web3 Development Masterclass"
3. ✅ Ввести описание: "Complete guide to blockchain and smart contract development"
4. ✅ Добавить 3+ урока:
   - "Introduction to Blockchain"
   - "Smart Contracts Basics"
   - "Deploying to Testnet"
5. ✅ Нажать "Create Course"

**Что показать:**
- 📝 Валидация полей (минимальные требования)
- ✅ Success toast уведомления
- 🔄 Автоматический редирект на My Courses

---

### 2️⃣ Отправка на верификацию (1 мин)

**URL:** `http://localhost:3002/my-courses`

**Действия:**
1. ✅ Найти созданный курс со статусом "📝 Draft"
2. ✅ Кликнуть "Submit for Verification"
3. ✅ В модальном окне заполнить "Proof of Completion":
   ```
   I completed all lessons including blockchain fundamentals, 
   smart contract development, and deployment practices. 
   Built and tested sample contracts on testnet.
   ```
4. ✅ Нажать "Submit for Verification"

**Что показать:**
- 📋 Модальное окно с информацией о процессе
- ⏳ Изменение статуса на "Pending"
- 💬 Toast уведомления

---

### 3️⃣ Админ-панель верификации (2 мин)

**URL:** `http://localhost:3002/verification`

**Действия:**
1. ✅ Увидеть список pending запросов
2. ✅ Кликнуть "Review Details" на одном из запросов
3. ✅ **Показать ОБА сценария:**

#### 🎯 Сценарий A: Успешная верификация

1. ✅ Кликнуть "✅ Verify & Issue Certificate"
2. ✅ Показать success уведомления
3. ✅ Объяснить, что происходит gasless minting NFT

**Результат:**
```
✅ "Course verified! NFT certificate will be minted."
💬 "Student 0x123...789 will receive their certificate"
```

#### ❌ Сценарий B: Отказ в верификации

1. ✅ Кликнуть "❌ Reject Request"
2. ✅ В модальном окне ввести причину:
   ```
   Course content needs more depth. Please add:
   - Advanced smart contract patterns
   - Security best practices section
   - At least 2 more lessons with practical examples
   - Code samples for each lesson
   ```
3. ✅ Кликнуть "Confirm Rejection"

**Результат:**
```
✅ "Request rejected. Student has been notified."
```

---

### 4️⃣ Результаты для студента (1 мин)

**URL:** `http://localhost:3002/my-courses`

#### 🎉 Если VERIFIED:

**Что показать:**
- ✅ Статус "Verified" с зеленым badge
- 🎓 Кнопка "Claim NFT Certificate"
- 📅 Дата верификации
- 🔗 Клик на кнопку → переход к сертификатам

#### 😔 Если REJECTED:

**Что показать:**
- ❌ Статус "Rejected" с красным badge
- 📝 Детальная причина отказа (видна студенту!)
- 📅 Дата отклонения
- 🔄 Кнопка "Review & Resubmit"
- 💡 Возможность исправить и отправить заново

---

## 🎨 Визуальная демонстрация статусов

### Draft (📝)
```
┌────────────────────────────────────┐
│ Introduction to Web3 Development   │
│ [📝 Draft]                         │
│                                    │
│ 💡 Ready to get your certificate? │
│ Submit for verification!           │
│                                    │
│ [Submit for Verification →]        │
└────────────────────────────────────┘
```

### Submitted (⏳)
```
┌────────────────────────────────────┐
│ Introduction to Web3 Development   │
│ [⏳ Pending]                        │
│                                    │
│ ⏳ Under Review                    │
│ Your course is being verified      │
│ by our team                        │
│                                    │
│ Submitted: October 25, 2024        │
└────────────────────────────────────┘
```

### Verified (✅)
```
┌────────────────────────────────────┐
│ Introduction to Web3 Development   │
│ [✅ Verified]                       │
│                                    │
│ ✅ Verified!                       │
│ Your course has been approved      │
│                                    │
│ Verified: October 25, 2024         │
│                                    │
│ [🎓 Claim NFT Certificate]         │
└────────────────────────────────────┘
```

### Rejected (❌)
```
┌────────────────────────────────────┐
│ Introduction to Web3 Development   │
│ [❌ Rejected]                       │
│                                    │
│ ❌ Verification Rejected           │
│                                    │
│ Reason: Course content needs more  │
│ depth. Please add advanced topics  │
│ and practical examples...          │
│                                    │
│ Rejected: October 25, 2024         │
│                                    │
│ [📝 Review & Resubmit]             │
└────────────────────────────────────┘
```

---

## 🎯 Ключевые моменты для демонстрации

### ✅ Покажите обязательно:

1. **Валидация:**
   - Попробуйте отправить курс с 1-2 уроками → ошибка
   - Покажите требование минимум 3 урока

2. **Toast уведомления:**
   - Success при создании
   - Info при отправке
   - Success/Error при верификации

3. **Два сценария верификации:**
   - Успешная → клеймится NFT
   - Отказ → студент видит причину

4. **Детальная причина отказа:**
   - Админ вводит конструктивный feedback
   - Студент видит детали и может исправить

5. **Цветовое кодирование:**
   - Серый (Draft)
   - Желтый (Pending)
   - Зеленый (Verified)
   - Красный (Rejected)

6. **Gasless мinting:**
   - Упомяните, что студент не платит за gas
   - Это происходит автоматически

---

## 💬 Что говорить во время демо

### При создании курса:
> "Студент создает курс с уроками. Система валидирует минимальные требования: не менее 5 символов в названии, 20 в описании, и минимум 3 урока для сертификации."

### При отправке:
> "После создания курс имеет статус Draft. Студент заполняет доказательство прохождения и отправляет на верификацию. Система автоматически меняет статус на Pending."

### В админ-панели:
> "Админ видит все запросы на верификацию с детальной информацией: курс, студент, количество уроков, доказательство прохождения."

### При верификации (Success):
> "Админ одобряет курс. Система автоматически запускает gasless minting NFT сертификата. Студент получает уведомление и может забрать свой NFT."

### При отказе:
> "Если курс не соответствует требованиям, админ может отклонить с детальной причиной. Студент видит конкретный feedback: что нужно улучшить, добавить. Он может исправить курс и отправить повторно."

---

## 🎬 Timeline демонстрации

| Время | Действие | Страница |
|-------|----------|----------|
| 0:00 | Подключить кошелек | Dashboard |
| 0:30 | Создать курс | /create-course |
| 2:00 | Отправить на верификацию | /my-courses |
| 3:00 | Открыть админ-панель | /verification |
| 3:30 | Показать верификацию | /verification |
| 4:30 | Показать отказ | /verification |
| 5:30 | Вернуться к студенту | /my-courses |
| 6:30 | Показать оба результата | /my-courses |

---

## 🔧 Тестовые данные

### Демо-курсы уже в системе:

```javascript
// 1. Draft (можно отправить)
"Introduction to Web3 Development"
Status: draft
8 lessons, 4 weeks

// 2. Pending (ожидает верификации)
"Smart Contract Security"  
Status: submitted
6 lessons, 3 weeks
Submitted: Oct 22, 2024

// 3. Verified (можно получить сертификат)
"DeFi Protocols Explained"
Status: verified
12 lessons, 6 weeks
Verified: Oct 17, 2024

// 4. Rejected (с причиной отказа)
"Basic Solidity Programming"
Status: rejected
4 lessons, 2 weeks
Rejected: Oct 18, 2024
Reason: "Course content is too basic..."
```

---

## 🎯 Финальный чеклист

Перед демонстрацией убедитесь:

- [ ] Dev сервер запущен на порту 3002
- [ ] Браузер открыт на `http://localhost:3002`
- [ ] Кошелек подключен
- [ ] Все тестовые курсы отображаются
- [ ] Toast уведомления работают
- [ ] Модальные окна открываются
- [ ] Можете создать новый курс
- [ ] Можете отправить на верификацию
- [ ] Админ-панель доступна
- [ ] Оба сценария (verify/reject) работают

---

## 🎉 Готово к демонстрации!

Весь flow отшлифован и готов к показу! Удачи! 🚀

