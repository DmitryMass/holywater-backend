import winston, { format, transports } from 'winston';

// Формат для логов
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Создание логгера
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'screen-config-api' },
  transports: [
    // Вывод в консоль в человекочитаемом формате
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          return `[${info.timestamp}] ${info.service} ${info.level}: ${
            info.message
          }${info.stack ? '\n' + info.stack : ''}`;
        })
      ),
    }),
    // Запись ошибок в файл
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Запись всех логов в файл
    new transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Если не в production, также выводим логи в консоль с улучшенным форматированием
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
