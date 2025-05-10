// Создаем пользователя для доступа к базе данных
db.getSiblingDB('admin').auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

// Создаем базу данных, если она не существует
db = db.getSiblingDB('screen-config');

// Создаем пользователя приложения с правами на базу данных screen-config
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    { role: 'readWrite', db: 'screen-config' },
    { role: 'dbAdmin', db: 'screen-config' }
  ]
});

// Создаем коллекции (если они ещё не существуют)
db.createCollection('screenconfiggits');

// Вставляем тестовую конфигурацию экрана
db.screenconfiggits.insertOne({
  name: 'Пример главного экрана',
  sections: [
    {
      id: 'section1',
      type: 'banner',
      title: 'Популярные товары',
      items: [
        {
          id: 'item1',
          type: 'image',
          content: {
            title: 'Новая коллекция',
            subtitle: 'Весна-Лето 2024',
            imageUrl: 'https://example.com/banner1.jpg',
            actionUrl: 'app://products/category/new'
          }
        }
      ],
      settings: {
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        showTitle: true
      }
    },
    {
      id: 'section2',
      type: 'horizontalList',
      title: 'Категории',
      items: [
        {
          id: 'category1',
          type: 'category',
          content: {
            title: 'Электроника',
            imageUrl: 'https://example.com/electronics.jpg',
            actionUrl: 'app://products/category/electronics'
          }
        },
        {
          id: 'category2',
          type: 'category',
          content: {
            title: 'Одежда',
            imageUrl: 'https://example.com/clothing.jpg',
            actionUrl: 'app://products/category/clothing'
          }
        }
      ]
    }
  ],
  isActive: true,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}); 