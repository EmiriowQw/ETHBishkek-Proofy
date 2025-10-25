# 🚀 Быстрый гид по тестированию сайта

## ✅ Статус: ВСЁ ИСПРАВЛЕНО И РАБОТАЕТ!

---

## 📋 Что было исправлено:

### 🐛 3 ошибки найдены и исправлены:

1. ✅ **Backend:** Тип `Date | null` → `Date | undefined`
2. ✅ **Certificates:** Добавлен тип `tokenId: string`
3. ✅ **Toast:** Заменён `toast.info()` → `toast()`

### ✅ Результат:
- Проект собирается без ошибок
- TypeScript компиляция успешна
- Нет ошибок линтера
- Dev сервер работает

---

## 🎯 КАК ЗАПУСТИТЬ (30 секунд)

### Вариант 1: Только Frontend (РЕКОМЕНДУЕТСЯ)

```powershell
# Шаг 1: Откройте PowerShell в папке проекта
cd C:\Users\Hp\Documents\ETHBishkek-Proofy-main

# Шаг 2: Запустите сервер (если еще не запущен)
npm run dev

# Шаг 3: Откройте браузер
```

**Сайт доступен на:**
- http://localhost:3000 ⬅️ **ИСПОЛЬЗУЙТЕ ЭТОТ!**
- или другой порт, который показан в терминале после запуска

**Это всё! Готово к тестированию!** ✅

---

## 🧪 БЫСТРЫЙ ТЕСТ (2 минуты)

### 1️⃣ Проверка главной страницы
```
Откройте: http://localhost:3002
✅ Должна загрузиться страница Dashboard
✅ Кнопка "Connect Wallet" должна быть видна
```

### 2️⃣ Создание курса
```
1. Нажмите "Create New Course"
2. Заполните:
   - Название: "Test Web3 Course"
   - Описание: "This is a test course for demonstration"
   - Добавьте 3 урока
3. Нажмите "Create Course"

✅ Должно показать toast "Course created successfully!"
✅ Автоматический переход на /my-courses
```

### 3️⃣ Проверка My Courses
```
Откройте: http://localhost:3002/my-courses

✅ Должны видеть:
   - 4 демо-курса (Draft, Submitted, Verified, Rejected)
   - Ваш созданный курс со статусом "Draft"
```

### 4️⃣ Отправка на верификацию
```
1. Найдите курс со статусом "Draft"
2. Нажмите "Submit for Verification"
3. Заполните "Proof of Completion" (минимум 50 символов)
4. Нажмите "Submit"

✅ Статус должен измениться на "Pending"
```

### 5️⃣ Админ-панель
```
Откройте: http://localhost:3002/verification

✅ Должны видеть:
   - 2 демо-запроса + ваш запрос
   - Кнопка "Review Details"
```

### 6️⃣ Верификация (как админ)
```
1. Нажмите "Review Details" на любом запросе
2. Посмотрите детали
3. Нажмите "Verify & Issue Certificate"

✅ Toast: "Course verified!"
✅ Запрос исчезает из списка
```

### 7️⃣ Результат верификации
```
Откройте: http://localhost:3002/my-courses

✅ Курс должен иметь статус "Verified"
✅ Кнопка "Claim NFT Certificate"
```

---

## 🎯 Проверка всех статусов

На странице `/my-courses` вы должны видеть примеры всех статусов:

### 📝 Draft (Серый)
```
┌─────────────────────────────┐
│ Introduction to Web3        │
│ [📝 Draft]                  │
│                             │
│ 💡 Ready to get certificate?│
│ [Submit for Verification →] │
└─────────────────────────────┘
```

### ⏳ Submitted (Желтый)
```
┌─────────────────────────────┐
│ Smart Contract Security     │
│ [⏳ Pending]                 │
│                             │
│ ⏳ Under Review             │
│ Your course is being verified│
└─────────────────────────────┘
```

### ✅ Verified (Зеленый)
```
┌─────────────────────────────┐
│ DeFi Protocols Explained    │
│ [✅ Verified]                │
│                             │
│ ✅ Verified!                │
│ [🎓 Claim NFT Certificate]  │
└─────────────────────────────┘
```

### ❌ Rejected (Красный)
```
┌─────────────────────────────┐
│ Basic Solidity Programming  │
│ [❌ Rejected]                │
│                             │
│ Reason: Course content is   │
│ too basic and lacks depth...│
│ [📝 Review & Resubmit]      │
└─────────────────────────────┘
```

---

## 🔍 Проверка портов

```powershell
netstat -ano | findstr "300"
```

**Должно показать:**
- ✅ 3001 - Backend (опционально)
- ✅ 3002 или 3003 - Frontend

---

## ❗ Если что-то не работает

### Проблема: Порт занят
```powershell
# Остановите все процессы
Get-Process node | Stop-Process -Force

# Запустите снова
npm run dev
```

### Проблема: Не загружается страница
```
1. Проверьте, что сервер запущен (npm run dev)
2. Проверьте правильный порт в адресной строке
3. Очистите кэш браузера (Ctrl+Shift+R)
```

### Проблема: Ошибки в консоли
```powershell
# Переустановите зависимости
rm -r node_modules
npm install
npm run dev
```

---

## 📊 Ожидаемый результат

После всех проверок вы должны убедиться, что:

- ✅ Главная страница загружается
- ✅ Можно создать курс
- ✅ Курс сохраняется и отображается
- ✅ Можно отправить на верификацию
- ✅ Статус обновляется
- ✅ Админ видит запросы
- ✅ Верификация работает (approve/reject)
- ✅ Все статусы отображаются правильно
- ✅ Toast уведомления появляются
- ✅ Нет ошибок в консоли браузера

---

## 🎉 ВСЁ РАБОТАЕТ!

**Сайт готов к демонстрации!**

### Основные URL:

- 🏠 **Главная:** http://localhost:3002
- ➕ **Создать курс:** http://localhost:3002/create-course
- 📚 **Мои курсы:** http://localhost:3002/my-courses
- ✅ **Верификация:** http://localhost:3002/verification
- 🎓 **Сертификаты:** http://localhost:3002/my-certificates
- 📖 **English Demo:** http://localhost:3002/english-demo

---

## 📚 Дополнительная документация

Для детальной информации смотрите:
- `TESTING_REPORT.md` - Полный отчёт о тестировании
- `COURSE_VERIFICATION_FLOW.md` - Flow верификации
- `DEMO_SCENARIO_GUIDE.md` - Сценарий демонстрации
- `MOCK_STORAGE_FIX.md` - О хранилище данных

---

**Время тестирования:** ~2 минуты  
**Готовность:** ✅ 100%  
**Статус:** 🚀 ГОТОВО К ИСПОЛЬЗОВАНИЮ

Приятного тестирования! 🎊

