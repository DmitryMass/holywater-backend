FROM node:20-alpine

WORKDIR /app

# Установка зависимостей для разработки
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Открываем порты
EXPOSE 5000

# Команда для запуска в режиме разработки
CMD ["npm", "run", "dev"] 