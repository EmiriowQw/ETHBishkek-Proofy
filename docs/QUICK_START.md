# 🚀 Quick Start Guide - Proofy NFT

## ✅ Проблема решена!

Все зависимости установлены и проект готов к работе.

## 📦 Что установлено:

- ✅ Frontend dependencies (Next.js, React, Tailwind, RainbowKit, wagmi)
- ✅ Backend dependencies (Express, PostgreSQL, Sequelize, Ethers.js)
- ✅ Smart contract tools (Hardhat, OpenZeppelin, ethers)

## 🚀 Запуск проекта

### 1. Настройка окружения

Создайте файл `.env.local` в корневой директории:

```bash
cp env.example .env.local
```

Заполните переменные окружения:

```env
NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=0x...
NEXT_PUBLIC_GASLESS_MINTER_ADDRESS=0x...
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 2. Настройка базы данных (опционально)

```bash
# Создайте PostgreSQL базу данных
createdb proofy_nft

# Настройте backend/.env
cp backend/env.example backend/.env
```

### 3. Запуск локальной blockchain (для разработки)

В отдельном терминале:

```bash
npm run chain
```

### 4. Деплой смарт-контрактов (локально)

```bash
npm run deploy
```

### 5. Запуск фронтенда

```bash
npm run dev
```

Откройте браузер: http://localhost:3000

### 6. Запуск бэкенда (опционально)

В отдельном терминале:

```bash
cd backend
npm run dev
```

Backend будет доступен на: http://localhost:3001

## 🌐 Деплой на Status Sepolia

### 1. Получите Status токены

- Добавьте Status Sepolia в MetaMask:
  - Network Name: Status Sepolia
  - RPC URL: https://rpc.status.im/
  - Chain ID: 436
  - Currency Symbol: SNT

### 2. Настройте приватный ключ

Добавьте в `.env.local`:

```env
PRIVATE_KEY=your_private_key_here
```

### 3. Деплой контрактов

```bash
npm run deploy:status
```

### 4. Пополните GaslessMinter

```bash
npm run fund
```

### 5. Тестируйте gasless minting

```bash
npm run test-mint
```

## 📚 Основные команды

```bash
# Разработка
npm run dev              # Запустить Next.js dev server
npm run chain            # Запустить локальный Hardhat node
npm run deploy           # Деплой на локальную сеть
npm run deploy:status    # Деплой на Status Sepolia

# Gasless функции
npm run fund             # Пополнить GaslessMinter контракт
npm run test-mint        # Тестировать gasless minting

# Backend
cd backend
npm run dev              # Запустить backend в dev режиме
npm run build            # Собрать backend
npm start                # Запустить production backend

# Тестирование
npm test                 # Запустить тесты контрактов
```

## 🎯 Основные функции

### Для пользователя:

1. **Подключить кошелек** - MetaMask или другой Web3 кошелек
2. **Просмотреть курсы** - доступные обучающие программы
3. **Пройти курс** - выполнить задания и тесты
4. **Получить NFT** - gasless minting сертификата
5. **Просмотреть коллекцию** - все полученные сертификаты

### Для администратора:

1. **Деплой контрактов** - на Status Sepolia
2. **Пополнить контракт** - для gasless операций
3. **Управлять курсами** - через backend API
4. **Мониторинг** - транзакции и сертификаты

## 🔧 Структура проекта

```
proofy-nft/
├── contracts/              # Solidity смарт-контракты
│   ├── CertificateNFT.sol # ERC-721 NFT контракт
│   └── GaslessMinter.sol  # Gasless minting контракт
├── scripts/               # Скрипты деплоя и тестирования
├── pages/                 # Next.js страницы
│   ├── index.tsx         # Главная страница
│   ├── my-certificates.tsx
│   └── course/[id].tsx   # Страница курса
├── components/           # React компоненты
│   ├── CourseCard.tsx
│   └── CertificateCard.tsx
├── hooks/               # Custom React hooks
│   └── useCertificateNFT.ts
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   └── middleware/
│   └── package.json
└── README.md
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/connect` - Подключить кошелек
- `GET /api/auth/me` - Получить текущего пользователя

### Courses
- `GET /api/courses` - Список всех курсов
- `GET /api/courses/:id` - Детали курса
- `GET /api/courses/:id/progress` - Прогресс пользователя
- `PUT /api/courses/:id/progress` - Обновить прогресс

### Certificates
- `POST /api/certificates/mint` - Mint NFT сертификат
- `GET /api/certificates/user/:userId` - Сертификаты пользователя
- `GET /api/certificates/:tokenId` - Детали сертификата

## 🎨 UI Компоненты

- **CourseCard** - карточка курса с прогрессом
- **CertificateCard** - карточка NFT сертификата
- **ConnectButton** - кнопка подключения кошелька (RainbowKit)

## 🔐 Безопасность

- ✅ JWT аутентификация
- ✅ Валидация входных данных
- ✅ CORS настройки
- ✅ Rate limiting
- ✅ Безопасное хранение приватных ключей

## 📊 Мониторинг

```bash
# Проверить статус контрактов
npx hardhat run scripts/check-contracts.ts --network status-sepolia

# Проверить баланс контракта
npx hardhat run scripts/check-contract-balance.ts --network status-sepolia
```

## ❓ Troubleshooting

### Ошибка подключения к базе данных
```bash
# Проверьте, что PostgreSQL запущен
pg_isready

# Создайте базу данных
createdb proofy_nft
```

### Ошибка gasless minting
```bash
# Проверьте баланс контракта
npm run check-balance

# Пополните контракт
npm run fund
```

### Ошибки компиляции контрактов
```bash
# Очистите кэш
npx hardhat clean

# Перекомпилируйте
npx hardhat compile
```

## 🆘 Поддержка

Если возникли проблемы:
1. Проверьте логи в консоли
2. Убедитесь, что все env переменные настроены
3. Проверьте, что контракты задеплоены
4. Откройте Issue на GitHub

## 🎉 Готово к хакатону!

Проект полностью готов для демонстрации на хакатоне Status Network.

Основные преимущества:
- ✅ **Gasless транзакции** - пользователи не платят за газ
- ✅ **Status Network** - оптимизирован для Status Sepolia
- ✅ **Modern UI** - красивый и понятный интерфейс
- ✅ **Full-stack** - готовый фронтенд и бэкенд
- ✅ **Production-ready** - готов к деплою

---

**Happy Hacking! 🚀**


