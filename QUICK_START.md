# Быстрый старт Screen Config API

# Проект можно протестировать удаленно, для ручной работы локально следуйте инструкции ниже.

## Настройка и запуск проекта

1. **Клонирование репозитория**

```bash
git clone <repository-url>
```

2. **Создание файла окружения**

```bash
# Создание .env из шаблона
npm run setup:dev

# Проверка настроек окружения
npm run check-env
```

> **Примечание**: Если порт 5000 занят, измените порт в файле `.env`, например на 5001:
>
> ```
> PORT=5001
> ```
>
> Затем также обновите порт в `docker-compose.dev.yml`:
>
> ```yaml
> ports:
>   - '5001:5001'
> ```

3. **Запуск проекта в Docker**

```bash
# Сборка Docker контейнеров
npm run docker:build

# Запуск в режиме разработки с логами в консоли
npm run start:dev

# ИЛИ запуск в фоновом режиме
npm run start:dev:detached
```

4. **Проверка работоспособности**

Когда все контейнеры запустятся, API будет доступен на `http://localhost:5001` (или порт, указанный в `.env`).

```bash
# Проверка доступности API
curl http://localhost:5001/api/screen-configs
```

## Доступные сервисы

| Сервис        | URL                       | Описание                                                    |
| ------------- | ------------------------- | ----------------------------------------------------------- |
| REST API      | http://localhost:5001/api | Основной API для работы с конфигурациями экранов            |
| MongoDB       | localhost:37017           | База данных (доступна только внутри Docker и из приложения) |
| Mongo Express | http://localhost:8081     | Веб-интерфейс для работы с MongoDB                          |

## Доступы к Mongo Express

- **Логин**: `admin`
- **Пароль**: `password`

## API Endpoints для тестирования

### 1. Получение всех конфигураций

```bash
curl http://localhost:5001/api/screen-configs
```

### 2. Получение активной конфигурации

```bash
curl http://localhost:5001/api/screen
```

### 3. Создание новой конфигурации

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тестовый экран",
    "sections": [
      {
        "id": "section1",
        "type": "banner",
        "title": "Тестовый баннер",
        "items": [
          {
            "id": "item1",
            "type": "image",
            "content": {
              "title": "Тест",
              "imageUrl": "https://example.com/image.jpg"
            }
          }
        ],
        "settings": {
          "backgroundColor": "#f5f5f5"
        }
      }
    ],
    "isActive": true
  }' \
  http://localhost:5001/api/screen-configs
```

### 4. Получение конфигурации по ID

```bash
# Замените YOUR_CONFIG_ID на ID из ответа после создания
curl http://localhost:5001/api/screen-configs/YOUR_CONFIG_ID
```

### 5. Обновление конфигурации

```bash
# Замените YOUR_CONFIG_ID на ID существующей конфигурации
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленный экран",
    "sections": [
      {
        "id": "section1",
        "type": "banner",
        "title": "Обновленный баннер",
        "items": [
          {
            "id": "item1",
            "type": "image",
            "content": {
              "title": "Обновлено",
              "imageUrl": "https://example.com/updated.jpg"
            }
          }
        ]
      }
    ]
  }' \
  http://localhost:5001/api/screen-configs/YOUR_CONFIG_ID
```

### 6. Активация конфигурации

```bash
# Замените YOUR_CONFIG_ID на ID конфигурации
curl -X PUT http://localhost:5001/api/screen-configs/YOUR_CONFIG_ID/activate
```

### 7. Удаление конфигурации

```bash
# Замените YOUR_CONFIG_ID на ID неактивной конфигурации
curl -X DELETE http://localhost:5001/api/screen-configs/YOUR_CONFIG_ID
```

## Управление контейнерами

```bash
# Просмотр логов API
npm run docker:logs

# Просмотр логов MongoDB
npm run docker:logs:mongo

# Остановка всех контейнеров
npm run docker:down

# Остановка контейнеров и удаление данных
npm run docker:clean
```

## Работа с MongoDB напрямую

```bash
# Запуск клиента MongoDB
npm run docker:mongo:client
```
