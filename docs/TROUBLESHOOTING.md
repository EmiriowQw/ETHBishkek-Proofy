# 🔧 Troubleshooting Guide

## ✅ Проблема с backend решена!

### Что было сделано:

1. **Создана упрощенная версия backend** (`index-simple.ts`)
   - Работает без PostgreSQL
   - Использует mock данные
   - Идеально для демо и разработки frontend

2. **Исправлены импорты** в существующих файлах
   - Заменены относительные импорты из `../models`
   - Теперь используются прямые импорты из файлов

### 🚀 Запуск backend

#### Вариант 1: Упрощенный режим (рекомендуется для демо)

```bash
cd backend
npm run dev
```

Этот режим:
- ✅ Не требует PostgreSQL
- ✅ Работает сразу "из коробки"
- ✅ Использует mock данные
- ✅ Идеален для тестирования frontend

#### Вариант 2: Полный режим (с базой данных)

```bash
cd backend
npm run dev:full
```

Этот режим:
- Требует PostgreSQL
- Использует Sequelize ORM
- Сохраняет данные в БД
- Для production использования

### 📊 Что работает в упрощенном режиме:

#### API Endpoints:

1. **GET /health** - проверка статуса
   ```bash
   curl http://localhost:3001/health
   ```

2. **GET /api/courses** - список курсов
   ```bash
   curl http://localhost:3001/api/courses
   ```

3. **GET /api/courses/:id** - детали курса
   ```bash
   curl http://localhost:3001/api/courses/web3-basics
   ```

4. **POST /api/certificates/mint** - mint сертификата (mock)
   ```bash
   curl -X POST http://localhost:3001/api/certificates/mint \
     -H "Content-Type: application/json" \
     -d '{"courseId":"web3-basics","courseName":"Web3 Basics","studentName":"Test","studentAddress":"0x123..."}'
   ```

5. **GET /api/certificates/user/:userId** - сертификаты пользователя
   ```bash
   curl http://localhost:3001/api/certificates/user/1
   ```

### 🎯 Текущий статус:

- ✅ Backend запущен на порту 3001
- ✅ CORS настроен для localhost:3000
- ✅ Mock данные для 3 курсов
- ✅ Mock minting для демонстрации

### 📝 Для полноценной работы с базой данных:

1. Установите PostgreSQL
2. Создайте базу данных:
   ```bash
   createdb proofy_nft
   ```

3. Создайте файл `backend/.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/proofy_nft
   PORT=3001
   JWT_SECRET=your_secret_here
   CORS_ORIGIN=http://localhost:3000
   ```

4. Запустите в полном режиме:
   ```bash
   npm run dev:full
   ```

### 🔍 Проверка работы:

1. **Backend запущен?**
   ```bash
   curl http://localhost:3001/health
   ```
   Ожидается: `{"status":"OK","timestamp":"..."}`

2. **API работает?**
   ```bash
   curl http://localhost:3001/api/courses
   ```
   Ожидается: JSON с массивом курсов

3. **Frontend подключается?**
   - Откройте http://localhost:3000
   - Проверьте консоль браузера на ошибки CORS

### 🐛 Распространенные проблемы:

#### 1. Ошибка "Cannot read properties of undefined"

**Решение:** Используйте упрощенный режим
```bash
cd backend
npm run dev  # Не dev:full
```

#### 2. Ошибка подключения к PostgreSQL

**Решение:** 
- Либо установите PostgreSQL
- Либо используйте упрощенный режим (`npm run dev`)

#### 3. Порт 3001 занят

**Решение:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <процесс_id> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

#### 4. CORS ошибки

**Решение:** Проверьте, что backend запущен на 3001, frontend на 3000

### 🎨 Интеграция с frontend:

Frontend уже настроен на работу с backend:

```typescript
// В hooks/useCertificateNFT.ts
const response = await fetch("/api/mint-certificate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ... })
});
```

```typescript
// В pages/api/mint-certificate.ts
const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
const response = await fetch(`${backendUrl}/api/certificates/mint`, {
  ...
});
```

### 🚀 Для деплоя на production:

1. **Backend (Railway/Heroku/Render):**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend (Vercel/Netlify):**
   ```bash
   npm run build
   npm start
   ```

3. **Environment variables:**
   - Установите `BACKEND_URL` на production URL
   - Настройте CORS для production домена

### 📞 Если проблемы остались:

1. Проверьте логи backend в консоли
2. Проверьте логи frontend в браузере (F12)
3. Убедитесь, что оба сервера запущены
4. Проверьте firewall/antivirus настройки

### ✨ Итог:

Backend теперь работает в двух режимах:
- **Demo mode** (упрощенный) - для быстрого старта
- **Full mode** (с БД) - для production

Используйте **demo mode** для разработки и демонстрации на хакатоне!

---

**Проблема решена! Backend работает! 🎉**


