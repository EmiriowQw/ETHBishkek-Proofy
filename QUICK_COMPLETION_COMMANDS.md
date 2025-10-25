# ⚡ БЫСТРЫЕ КОМАНДЫ ДЛЯ ЗАВЕРШЕНИЯ НА 100%

## Для использования в новом чате

---

## 🎯 ЧТО СКАЗАТЬ AI В НОВОМ ЧАТЕ

```
Привет! Мне нужно завершить проект Proofy "Proof of Anything" на 100% для хакатона.

Текущий статус: Backend 100%, Frontend 100%, Components 100%, Documentation 100%

Задачи:
1. Проверь, что все файлы существуют (список ниже)
2. Запусти backend и frontend
3. Протестируй полный flow: Create Achievement → Verify → Claim NFT
4. Исправь любые ошибки
5. Подтверди 100% готовность

Используй план из: COMPLETION_PLAN_FOR_NEW_CHAT.md

Ключевые файлы для проверки:
- backend/src/index-simple.ts (13+ endpoints)
- pages/index.tsx (Dashboard)
- pages/create-achievement.tsx (Wizard)
- pages/my-achievements.tsx (Management)
- pages/become-verifier.tsx (Registration)
- pages/verification.tsx (Panel)
- pages/my-certificates.tsx (NFT Gallery)
- components/CategorySelector.tsx
- components/ImageUpload.tsx
- components/categories/*.tsx (5 файлов)

Начни с проверки файлов командой:
ls pages/index.tsx pages/create-achievement.tsx pages/my-achievements.tsx pages/become-verifier.tsx pages/verification.tsx pages/my-certificates.tsx
```

---

## 📋 КОМАНДЫ ДЛЯ ПРОВЕРКИ ФАЙЛОВ

### Проверить все страницы:
```bash
ls pages/index.tsx pages/create-achievement.tsx pages/my-achievements.tsx pages/become-verifier.tsx pages/verification.tsx pages/my-certificates.tsx
```

### Проверить компоненты:
```bash
ls components/CategorySelector.tsx components/ImageUpload.tsx components/categories/EducationFields.tsx components/categories/SportsFields.tsx components/categories/VolunteeringFields.tsx components/categories/SkillsFields.tsx components/categories/CustomFields.tsx
```

### Проверить API proxies:
```bash
ls pages/api/categories/index.ts pages/api/categories/custom.ts pages/api/achievements/create.ts pages/api/achievements/my-achievements.ts pages/api/achievements/submit-verification.ts pages/api/verifiers/register.ts pages/api/verifiers/my-role.ts pages/api/certificates/claim.ts pages/api/certificates/user/[address].ts
```

### Проверить backend:
```bash
ls backend/src/index-simple.ts
```

---

## 🚀 КОМАНДЫ ДЛЯ ЗАПУСКА

### Установка (если нужно):
```bash
npm install
cd backend && npm install && cd ..
```

### Запуск backend (терминал 1):
```bash
cd backend
npm run dev
```

### Запуск frontend (терминал 2):
```bash
npm run dev
```

### Или запустить всё в фоне (Windows PowerShell):
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Sleep -Seconds 3
npm run dev
```

---

## 🧪 БЫСТРЫЙ ТЕСТ (1 минута)

```bash
# 1. Проверить backend
curl http://localhost:3001/api/categories

# 2. Открыть frontend
start http://localhost:3000

# 3. В браузере:
# - Подключить кошелёк ✅
# - Dashboard загружается ✅
# - Нажать "Create Achievement" ✅
# - Категории отображаются ✅
```

---

## 📝 СПИСОК ФАЙЛОВ ДЛЯ AI (если нужно создать)

### Backend Endpoints (backend/src/index-simple.ts):
```typescript
// Должны быть:
app.get('/api/categories')
app.post('/api/categories/custom')
app.post('/api/achievements/create')
app.get('/api/achievements/my-achievements')
app.post('/api/achievements/submit-verification')
app.post('/api/verifiers/register')
app.get('/api/verifiers/my-role')
app.get('/api/verification/requests')
app.post('/api/verification/verify')
app.post('/api/certificates/claim')
app.get('/api/certificates/user/:address')
```

### Frontend Pages:
- `pages/index.tsx` - Dashboard с категориями
- `pages/create-achievement.tsx` - Wizard с CategorySelector
- `pages/my-achievements.tsx` - Список с фильтрами
- `pages/become-verifier.tsx` - Регистрация
- `pages/verification.tsx` - Панель с category filters
- `pages/my-certificates.tsx` - NFT gallery с цветами

### Components:
- `components/CategorySelector.tsx` - Выбор категории + create custom
- `components/ImageUpload.tsx` - Drag&drop upload
- `components/categories/EducationFields.tsx` - institution, degree, etc.
- `components/categories/SportsFields.tsx` - sportType, event, etc.
- `components/categories/VolunteeringFields.tsx` - organization, hours, etc.
- `components/categories/SkillsFields.tsx` - skillName, level, etc.
- `components/categories/CustomFields.tsx` - dynamic fields

### API Proxies (все проксируют на http://localhost:3001):
- `pages/api/categories/index.ts`
- `pages/api/categories/custom.ts`
- `pages/api/achievements/create.ts`
- `pages/api/achievements/my-achievements.ts`
- `pages/api/achievements/submit-verification.ts`
- `pages/api/verifiers/register.ts`
- `pages/api/verifiers/my-role.ts`
- `pages/api/verification/requests.ts` (с поддержкой category filter)
- `pages/api/verification/verify.ts` (courseId и achievementId)
- `pages/api/certificates/claim.ts` (courseId и achievementId)
- `pages/api/certificates/user/[address].ts`

---

## ❌ ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ - СКАЖИ AI:

### Backend не запускается:
```
Backend не запускается. Проверь файл backend/src/index-simple.ts:
1. Есть ли все 13 endpoints?
2. Есть ли массивы: categories, mockAchievements, mockVerifiers, mockCertificates?
3. Покажи ошибки при запуске

Если нужно, создай недостающие endpoints по шаблону из HACKATHON_READY.md
```

### Frontend не запускает:
```
Frontend не запускается. Проверь:
1. Все ли страницы существуют? (index, create-achievement, my-achievements, become-verifier, verification, my-certificates)
2. Все ли компоненты существуют? (CategorySelector, ImageUpload, categories/*)
3. Есть ли TypeScript ошибки?

Покажи ошибки компиляции
```

### Какой-то компонент отсутствует:
```
Компонент [название] не найден. Создай его по шаблону:

Для CategorySelector.tsx - должен:
- Загружать категории из /api/categories
- Отображать 4 + custom категории
- Иметь кнопку "Create Custom"
- Модальное окно для создания

Для ImageUpload.tsx - должен:
- Drag & drop
- Валидация (5MB max, jpg/png/webp)
- Preview
- Base64 encoding

Для category fields - должен:
- Принимать specificData, onFieldChange
- Отображать специфичные поля категории
```

### Тест не проходит:
```
Тест не проходит на шаге: [описание шага]
Ошибка: [описание ошибки]

Проверь:
1. Backend endpoint отвечает?
2. Frontend proxy корректно проксирует?
3. Данные сохраняются в mockAchievements/mockVerifiers?
4. Console.log в backend показывает запрос?

Исправь проблему
```

---

## ✅ КРИТЕРИИ ЗАВЕРШЕНИЯ - СКАЖИ AI:

```
Подтверди 100% готовность. Проверь:

1. ✅ Backend запущен на :3001
2. ✅ Frontend запущен на :3000
3. ✅ Создание достижения работает
4. ✅ Регистрация верификатора работает
5. ✅ Верификация работает
6. ✅ Claim NFT работает
7. ✅ NFT отображается с правильными цветами
8. ✅ Все 4 категории работают
9. ✅ Нет критических ошибок в консоли

Если все ✅ - выведи success message
```

---

## 🎉 SUCCESS MESSAGE ДЛЯ AI

После успешной проверки попроси AI вывести:

```
Выведи красивое сообщение о том, что система готова на 100%:
- Backend: количество endpoints
- Frontend: количество страниц
- Components: количество компонентов
- Все тесты пройдены
- Готово к хакатону

И покажи команды для запуска
```

---

## 📚 ДОКУМЕНТАЦИЯ ДЛЯ СПРАВКИ

Если AI нужны детали, отправь его к:
- `COMPLETION_PLAN_FOR_NEW_CHAT.md` - полный план
- `HACKATHON_READY.md` - описание системы
- `TESTING_GUIDE.md` - тестирование
- `PROOF_OF_ANYTHING_COMPLETE.md` - summary

---

## 🎯 ФИНАЛЬНАЯ КОМАНДА

Когда всё готово:
```
Система готова! Создай файл READY_FOR_HACKATHON.txt с датой и временем.
Выведи итоговую статистику и пожелание удачи!
```

---

*Копируй эти команды и сообщения в новый чат для быстрого завершения проекта!*

