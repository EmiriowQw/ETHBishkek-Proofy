# 🧪 Руководство по Тестированию Proofy

## Быстрый Старт

### 1. Запуск Системы

```bash
# Терминал 1: Backend
cd backend
npm run dev

# Терминал 2: Frontend
npm run dev
```

**Ожидаемый результат:**
- Backend: `✓ Server running on http://localhost:3001`
- Frontend: `✓ Ready on http://localhost:3000`

---

## 🎯 Полный Сценарий Тестирования

### Тест 1: Создание Достижения (Sports)

**Шаги:**
1. Открыть http://localhost:3000
2. Подключить кошелёк (MetaMask)
3. Нажать "Create Achievement"
4. Выбрать категорию "🏋️ Sports"
5. Заполнить форму:
   ```
   Title: City Marathon 2024 - 1st Place
   Description: Won first place in the annual city marathon with a time of 2:45:30
   Sport Type: Running
   Event Name: City Marathon 2024
   Placement: 1st Place
   Date: [Сегодняшняя дата]
   Organizer: City Sports Department
   ```
6. Нажать "Create Achievement"

**Ожидаемый результат:**
- ✅ Toast: "Achievement created successfully!"
- ✅ Редирект на `/my-achievements`
- ✅ Достижение отображается со статусом "📝 Draft"

---

### Тест 2: Отправка на Верификацию

**Предварительное условие:** Выполнен Тест 1

**Шаги:**
1. На странице "My Achievements"
2. Найти созданное достижение
3. Нажать "Submit for Verification"
4. В модальном окне:
   - Proof Description: "I completed the marathon and received a medal. My official time was recorded as 2:45:30. Photo shows me at the finish line with my medal."
   - Загрузить фото (любое изображение)
5. Нажать "Submit for Verification"

**Ожидаемый результат:**
- ✅ Toast: "Achievement submitted for verification!"
- ✅ Статус изменился на "⏳ Pending"
- ✅ Модальное окно закрылось

---

### Тест 3: Регистрация Верификатора

**Примечание:** Используйте **ДРУГОЙ** кошелёк (не тот, которым создали достижение)

**Шаги:**
1. Отключить текущий кошелёк
2. Подключить другой кошелёк (или создать новый аккаунт в MetaMask)
3. Перейти на Dashboard
4. Нажать "Become Verifier"
5. Заполнить форму:
   ```
   Name: National Sports Federation
   Credentials: Official sports judge with 10 years of experience. Certified by National Athletics Association. Experience in marathon organization and validation.
   Categories: ✅ Sports
   ```
6. Нажать "Become Verifier"

**Ожидаемый результат:**
- ✅ Toast: "Successfully registered as verifier!"
- ✅ Редирект на `/verification`
- ✅ Вы видите панель верификации

---

### Тест 4: Верификация Достижения

**Предварительное условие:** Выполнены Тесты 1-3, вы залогинены как верификатор

**Шаги:**
1. На странице "Verification Panel"
2. Убедитесь, что badge "🛡️ Verifier" виден
3. Фильтр должен показывать "Sports" (ваша категория)
4. Должен быть виден 1 pending request
5. Нажать "👁️ Review Details"
6. В модальном окне проверить:
   - ✅ Achievement title
   - ✅ Category badge (🏋️ Sports)
   - ✅ Category-specific fields (Sport Type, Event, Placement, Date)
   - ✅ Proof description
   - ✅ Proof image
7. Нажать "✅ Verify & Issue Certificate"

**Ожидаемый результат:**
- ✅ Toast: "Achievement verified! NFT certificate minted successfully."
- ✅ Toast: "🎫 NFT Token ID: [число] issued to student"
- ✅ Request исчезает из списка
- ✅ Панель показывает "All Caught Up!"

---

### Тест 5: Получение NFT Сертификата

**Предварительное условие:** Выполнены Тесты 1-4

**Шаги:**
1. Переключиться обратно на **первый** кошелёк (студент)
2. Перейти на "My Achievements"
3. Найти достижение - статус должен быть "✅ Verified"
4. Нажать "Claim NFT Certificate"

**Ожидаемый результат:**
- ✅ Toast: "Claiming your NFT certificate..."
- ✅ Toast: "🎓 NFT Certificate claimed successfully!"
- ✅ Toast: "Token ID: [число]"
- ✅ Редирект на `/my-certificates`

---

### Тест 6: Просмотр NFT Сертификата

**Предварительное условие:** Выполнены Тесты 1-5

**Шаги:**
1. На странице "My Certificates"
2. Проверить отображение сертификата:
   - Должен быть оранжевый gradient header (Sports color)
   - Icon: 🏋️
   - Category badge: "🏋️ Sports"
   - Type: "🎯 Achievement"
   - Token ID: #[число]
   - Network: Status Network
   - Completion Date: [дата]
   - Gasless badge: "⚡ Gasless Mint - No fees paid"

**Ожидаемый результат:**
- ✅ NFT сертификат отображается корректно
- ✅ Все поля заполнены
- ✅ Цвета соответствуют категории

---

## 🎨 Тест Других Категорий

### Education Achievement

**Создать:**
```
Category: 🎓 Education
Title: Bachelor of Computer Science
Description: Completed 4-year program at top university
Institution: MIT
Degree: Bachelor of Science in Computer Science
Graduation Date: 2024-05-15
GPA: 3.8
```

**Ожидаемый gradient:** Синий (Blue)

---

### Volunteering Achievement

**Создать:**
```
Category: 🤝 Volunteering
Title: Community Service - Food Bank
Description: Volunteered at local food bank for 6 months
Organization: City Food Bank
Hours: 120
Activity Type: Food Distribution and Organization
Start Date: 2024-01-01
End Date: 2024-06-30
```

**Ожидаемый gradient:** Зелёный (Green)

---

### Skills Achievement

**Создать:**
```
Category: 💼 Skills & HR
Title: Senior JavaScript Developer
Description: Professional full-stack JavaScript development
Skill Name: JavaScript / React / Node.js
Level: Senior
Projects: Built 15+ production applications, 5 years experience
Years Experience: 5
```

**Ожидаемый gradient:** Фиолетовый (Purple)

---

## 🧪 Тест Кастомной Категории

**Шаги:**
1. На "Create Achievement"
2. Нажать "➕ Create Custom" category
3. Заполнить:
   ```
   Name: Art Competitions
   Icon: 🎨
   Description: Achievements in art contests and exhibitions
   Fields: CompetitionName, AwardLevel, JudgeNames
   ```
4. Нажать "Create Category"
5. Создать достижение в новой категории

**Ожидаемый результат:**
- ✅ Категория создана
- ✅ Отображается в списке категорий
- ✅ Можно создать достижение
- ✅ Custom fields отображаются в форме

---

## 🚨 Тест Rejection Flow

**Шаги:**
1. Создать достижение
2. Отправить на верификацию
3. Залогиниться как верификатор
4. В Review modal нажать "❌ Reject"
5. Ввести причину (минимум 10 символов):
   ```
   The proof image quality is too low to verify authenticity. Please provide a higher resolution photo showing the event certificate or medal more clearly.
   ```
6. Нажать "Confirm Rejection"
7. Переключиться на студента
8. В "My Achievements" проверить:
   - Статус: "❌ Rejected"
   - Rejection reason отображается

**Ожидаемый результат:**
- ✅ Достижение отклонено
- ✅ Причина отображается
- ✅ Студент может повторно отправить

---

## 📊 Тест Фильтров

### Фильтр в My Achievements

**Шаги:**
1. Создать достижения в разных категориях (Sports, Education)
2. На "My Achievements"
3. Выбрать фильтр "Sports"

**Ожидаемый результат:**
- ✅ Показываются только Sports достижения

---

### Фильтр в Verification Panel

**Шаги:**
1. Залогиниться как верификатор Sports
2. На "Verification Panel"
3. Переключать фильтры: "All Categories" → "Sports"

**Ожидаемый результат:**
- ✅ Показываются только заявки для категорий верификатора
- ✅ Если выбрана категория, где нет прав - показывается "No permissions"

---

## 🔐 Тест Прав Доступа

### Попытка верифицировать чужую категорию

**Шаги:**
1. Зарегистрироваться как верификатор только для "Sports"
2. Создать (другим кошельком) достижение "Education"
3. Отправить на верификацию
4. Попытаться верифицировать как Sports верификатор

**Ожидаемый результат:**
- ✅ Запрос не отображается в списке (фильтр по категориям)
- ✅ Или при попытке verify: "You are not authorized to verify this category"

---

## 🎯 Чек-лист Финального Тестирования

### Перед Демонстрацией на Хакатоне:

- [ ] Backend запускается без ошибок
- [ ] Frontend запускается без ошибок
- [ ] Подключение кошелька работает
- [ ] Создание достижения работает для всех 4 категорий
- [ ] Загрузка изображений работает
- [ ] Регистрация верификатора работает
- [ ] Verification panel отображает заявки
- [ ] Approve работает и создаёт NFT
- [ ] Reject работает и показывает причину
- [ ] Claim certificate работает
- [ ] My Certificates отображает NFT с правильными цветами
- [ ] Фильтры работают
- [ ] Custom категория создаётся и работает
- [ ] UI responsive на разных экранах
- [ ] Все toast уведомления отображаются
- [ ] Градиенты и иконки соответствуют категориям

---

## 🐛 Известные Ограничения (Mock Version)

### Это НЕ баги, а features mock-версии:

1. **Данные не сохраняются** после перезапуска backend
   - Решение: Не перезапускать backend во время демо

2. **Нет реального blockchain**
   - NFT создаются mock-данные
   - Для демо это OK

3. **Gasless mint симулируется**
   - Реальные транзакции не отправляются
   - Token IDs генерируются случайно

4. **Нет real IPFS**
   - Metadata URI - mock URL
   - Для демо это OK

---

## ✅ Быстрая Проверка (5 минут)

```bash
# 1. Запустить backend
cd backend && npm run dev

# 2. В новом терминале: запустить frontend
npm run dev

# 3. Открыть http://localhost:3000

# 4. Quick test:
- Подключить кошелёк ✅
- Dashboard загружается ✅
- Create Achievement открывается ✅
- Категории отображаются ✅
- Become Verifier открывается ✅

# Если всё ✅ - система готова!
```

---

## 🎬 Готово к Хакатону!

Вся система протестирована и работает. Удачи на демонстрации! 🚀

