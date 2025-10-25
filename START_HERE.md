# 🚀 START HERE - Proofy NFT

## ✅ Проблемы решены! Готов к запуску!

### 📦 Что установлено:
- ✅ Frontend (Next.js + React + TypeScript)
- ✅ Backend (Express + TypeScript, demo mode)
- ✅ Smart Contracts (Hardhat + Solidity)
- ✅ Все зависимости установлены

---

## 🎯 Быстрый старт (2 минуты)

### Шаг 1: Запустить Backend (уже запущен)

Backend работает в **DEMO режиме** (без базы данных):

```bash
cd E:\Projects\Proofy-mvp\proofy-nft\backend
npm run dev
```

Должно появиться:
```
🚀 Server running on port 3001
📚 API: http://localhost:3001/api
🏥 Health: http://localhost:3001/health
⚠️  Running in DEMO mode (no database)
```

### Шаг 2: Запустить Frontend

В **новом терминале**:

```bash
cd E:\Projects\Proofy-mvp\proofy-nft
npm run dev
```

Должно появиться:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Шаг 3: Открыть в браузере

Откройте: **http://localhost:3000**

---

## 🎨 Что можно делать:

1. **Подключить кошелек** - нажмите "Connect Wallet"
2. **Просмотреть курсы** - 3 demo курса доступны
3. **Просмотреть сертификаты** - "My Certificates" в меню
4. **UI полностью работает** - красивый интерфейс готов

---

## ⚠️ Важно: Demo режим

Backend работает в **demo режиме**:
- ✅ Не требует PostgreSQL
- ✅ Использует mock данные
- ✅ API endpoints работают
- ⚠️ Данные не сохраняются (для demo это OK)

Для production нужно:
1. Установить PostgreSQL
2. Настроить `.env` файлы
3. Запустить `npm run dev:full` в backend

---

## 🔗 Для работы с блокчейном:

### Локальная сеть (для разработки):

**Терминал 3:**
```bash
cd E:\Projects\Proofy-mvp\proofy-nft
npm run chain
```

**Терминал 4:**
```bash
npm run deploy
```

### Status Sepolia (для production):

1. Создайте `.env.local`:
```env
PRIVATE_KEY=your_metamask_private_key
NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=
NEXT_PUBLIC_GASLESS_MINTER_ADDRESS=
```

2. Деплой:
```bash
npm run deploy:status
```

3. Пополните контракт:
```bash
npm run fund
```

---

## 📊 Проверка статуса:

### Backend работает?
```bash
curl http://localhost:3001/health
# Ожидается: {"status":"OK","timestamp":"..."}
```

### Frontend работает?
Откройте: http://localhost:3000

### API работает?
```bash
curl http://localhost:3001/api/courses
# Ожидается: JSON с курсами
```

---

## 🎯 Архитектура проекта:

```
User Browser (http://localhost:3000)
         ↓
    Frontend (Next.js)
         ↓
    Backend API (http://localhost:3001)
         ↓
  [Mock Data] ← DEMO MODE
  [PostgreSQL] ← FULL MODE
         ↓
  Smart Contracts (Status Network)
```

---

## 📁 Структура файлов:

```
proofy-nft/
├── backend/
│   ├── src/
│   │   ├── index-simple.ts    ← DEMO backend (активен)
│   │   └── index.ts           ← Full backend (требует БД)
│   └── package.json
├── pages/
│   ├── index.tsx              ← Главная страница
│   ├── my-certificates.tsx    ← Страница сертификатов
│   └── course/[id].tsx        ← Страница курса
├── components/
│   ├── CourseCard.tsx
│   └── CertificateCard.tsx
├── contracts/
│   ├── CertificateNFT.sol
│   └── GaslessMinter.sol
└── scripts/
    ├── deploy.ts
    └── fund-gasless-minter.ts
```

---

## 🐛 Если что-то не работает:

### Backend не запускается?
```bash
cd backend
npm install
npm run dev
```

### Frontend не запускается?
```bash
cd ..
npm install
npm run dev
```

### Порт занят?
```bash
# Остановите процесс на порту 3001 или 3000
netstat -ano | findstr :3001
taskkill /PID <process_id> /F
```

---

## 📚 Документация:

- **README.md** - полное описание проекта
- **QUICK_START.md** - быстрый старт с деталями
- **DEPLOYMENT.md** - инструкции по деплою
- **TROUBLESHOOTING.md** - решение проблем
- **PROJECT_SUMMARY.md** - технические детали

---

## 🎉 Готово к демонстрации!

Проект полностью готов для:
- ✅ Разработки
- ✅ Демонстрации на хакатоне
- ✅ Тестирования функционала
- ✅ Подключения к Status Network

---

## 🚀 Следующие шаги:

1. **Для демо на хакатоне:**
   - Запустите frontend и backend
   - Покажите UI и функционал
   - Объясните gasless концепцию

2. **Для production:**
   - Настройте PostgreSQL
   - Деплойте на Status Sepolia
   - Настройте IPFS (Pinata)
   - Запустите полный backend

3. **Для разработки:**
   - Запустите локальную blockchain
   - Деплойте контракты локально
   - Тестируйте функционал

---

## 💡 Полезные команды:

```bash
# Backend
cd backend
npm run dev          # Demo mode (рекомендуется)
npm run dev:full     # Full mode (требует БД)

# Frontend
npm run dev          # Запустить Next.js

# Blockchain
npm run chain        # Локальная сеть
npm run deploy       # Деплой локально
npm run deploy:status # Деплой на Status
npm run fund         # Пополнить контракт
npm run test-mint    # Тест gasless minting
```

---

**Удачи на хакатоне! 🚀**

*Backend работает в demo режиме - это нормально для демонстрации!*


