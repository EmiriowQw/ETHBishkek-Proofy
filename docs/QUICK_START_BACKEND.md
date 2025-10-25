# ✅ БЫСТРЫЙ СТАРТ: Backend интеграция

## 🎉 Готово! Данные теперь сохраняются в Backend!

---

## 🚀 ЧТО ЗАПУСТИТЬ:

### Терминал 1: Frontend
```powershell
npm run dev
```
**URL:** http://localhost:3000

### Терминал 2: Backend
```powershell
cd backend
npm run dev
```
**URL:** http://localhost:3001

---

## 🧪 БЫСТРЫЙ ТЕСТ (3 минуты):

### 1. Откройте сайт
```
http://localhost:3000
F12 (консоль)
```

### 2. Подключите кошелек
```
Connect Wallet → MetaMask
```

### 3. Создайте курс
```
Create Course
→ Название: "Test Course" (5+ символов)
→ Описание: "Test description about Web3" (20+ символов)
→ Добавьте 3 урока (50+ символов каждый)
→ Create
```

### 4. Проверьте логи

**Консоль браузера:**
```
📤 Proxying to Backend: Creating course
✅ Backend Response: { success: true }
```

**Терминал Backend:**
```
🎓 [BACKEND] Course created: course_...
🎓 [BACKEND] Total courses in DB: 1
```

### 5. Проверьте "My Courses"
```
Автоматически откроется
Курс должен быть в списке! ✅
```

---

## 🔍 ПРОВЕРКА ЧТО ВСЁ РАБОТАЕТ:

### Лог Frontend (Console):
```javascript
📤 Proxying to Backend: Creating course
📤 Title: Test Course
📤 Creator: 0x...
📤 Lessons: 3
✅ Backend Response: {...}
```

### Лог Backend (Terminal):
```
🎓 [BACKEND] Course created: course_1729851234567
🎓 [BACKEND] Title: Test Course
🎓 [BACKEND] Creator: 0x...
🎓 [BACKEND] Lessons: 3
🎓 [BACKEND] Total courses in DB: 1
```

**Если видите эти логи - ВСЁ РАБОТАЕТ!** ✅

---

## 💾 Где данные:

**Backend (порт 3001)** → `mockCourses[]` массив в памяти

**Персистентность:** Пока Backend работает ✅

**При перезапуске Backend:** Данные сбросятся (это нормально для mock storage)

---

## ⚠️ ВАЖНО:

### ДВА сервиса ДОЛЖНЫ работать:

- [ ] **Frontend** на порту 3000
- [ ] **Backend** на порту 3001

### БЕЗ Backend:
```
❌ Курсы НЕ сохраняются
❌ Ошибка: "Failed to fetch"
```

### С Backend:
```
✅ Курсы сохраняются
✅ Данные персистентны
✅ Логи работают
```

---

## 🔧 Если не работает:

### 1. Проверьте что Backend запущен:
```powershell
netstat -ano | findstr ":3001"
```
**Должно показать:** `LISTENING 3001`

### 2. Проверьте логи Backend:
```
🚀 Server running on port 3001
📚 API: http://localhost:3001/api
```

### 3. Проверьте консоль браузера:
```
Должны быть логи: 📤 Proxying to Backend...
```

### 4. Перезапустите всё:
```powershell
# Остановить
Get-Process node | Stop-Process -Force

# Запустить заново
# Терминал 1:
npm run dev

# Терминал 2:
cd backend
npm run dev
```

---

## 📊 Статус:

| Компонент | Статус | Порт | Логи |
|-----------|--------|------|------|
| Frontend | ✅ Работает | 3000 | Браузер Console |
| Backend | ✅ Работает | 3001 | Terminal |
| Интеграция | ✅ Настроена | - | Proxy logs |
| Данные | ✅ В Backend | - | mockCourses[] |

---

## ✅ Готово к тестированию!

```
1. npm run dev (Terminal 1)
2. cd backend; npm run dev (Terminal 2)
3. http://localhost:3000
4. Connect Wallet
5. Create Course
6. Проверьте логи в обоих терминалах
```

**Курсы сохраняются в Backend!** 🎉

---

**Полная документация:** `BACKEND_INTEGRATION_DONE.md`

**Дата:** 25 октября 2024  
**Статус:** ✅ РАБОТАЕТ

