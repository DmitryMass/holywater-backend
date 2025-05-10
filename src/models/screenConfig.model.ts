import mongoose, { Document, Schema } from 'mongoose';

/**
 * Интерфейс для контента элемента
 */
export interface ItemContent {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  actionUrl?: string;
  description?: string;
  price?: string;
  url?: string;
  link?: string;
  tags?: string[];
  [key: string]: any; // Для дополнительных свойств
}

/**
 * Интерфейс для элемента секции
 */
export interface IItem extends Document {
  id: string;
  type: 'image' | 'text' | 'button' | 'product' | 'category';
  content: ItemContent;
}

/**
 * Интерфейс для настроек секции
 */
export interface ISectionSettings extends Document {
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  showTitle?: boolean;
  [key: string]: any; // Для дополнительных настроек
}

/**
 * Интерфейс для секции конфигурации экрана
 */
export interface ISection extends Document {
  id: string;
  type: 'banner' | 'verticalList' | 'horizontalList' | 'grid' | 'hero';
  title?: string;
  items: IItem[];
  settings?: ISectionSettings;
}

/**
 * Интерфейс для конфигурации экрана
 */
export interface IScreenConfig extends Document {
  id: string;
  name: string;
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  version: number;
}

// Схема для контента элемента
const ItemContentSchema = new Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    imageUrl: { type: String },
    actionUrl: { type: String },
    description: { type: String },
    price: { type: String },
    url: { type: String },
    link: { type: String },
    tags: [{ type: String }],
  },
  { _id: false, strict: false }
); // strict: false позволяет добавлять дополнительные поля

// Схема для элемента
const ItemSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['image', 'text', 'button', 'product', 'category'],
    },
    content: {
      type: ItemContentSchema,
      required: true,
    },
  },
  { _id: false }
);

// Схема для настроек секции
const SectionSettingsSchema = new Schema(
  {
    backgroundColor: { type: String },
    padding: { type: String },
    borderRadius: { type: String },
    showTitle: { type: Boolean, default: true },
  },
  { _id: false, strict: false }
); // strict: false для дополнительных настроек

// Схема для секции
const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['banner', 'verticalList', 'horizontalList', 'grid', 'hero'],
    },
    title: { type: String },
    items: [ItemSchema],
    settings: SectionSettingsSchema,
  },
  { _id: false }
);

// Основная схема для конфигурации экрана
const ScreenConfigSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sections: [SectionSchema],
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // Автоматически добавляет createdAt и updatedAt
    versionKey: false,
  }
);

// Индексы для повышения производительности запросов
ScreenConfigSchema.index({ name: 1 });
ScreenConfigSchema.index({ createdAt: -1 });
ScreenConfigSchema.index({ updatedAt: -1 });

export default mongoose.model<IScreenConfig>(
  'ScreenConfig',
  ScreenConfigSchema
);
