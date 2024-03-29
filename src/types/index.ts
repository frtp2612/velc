import { TranslationType } from "@/enums";

export type ElementSize = {
  min?: number;
  max?: number;
};

export type BaseElementSize = ElementSize & {
  initial?: number;
};

export type CalculatedElementSize = ElementSize & {
  current?: number;
};

export type Translatable =
  | RawTranslationValue
  | ExplicitTranslationValue
  | KeyTranslationValue;

type BaseTranslationValue = {
  trailingText?: Translatable | string;
};

export type RawTranslationValue = BaseTranslationValue & {
  type: TranslationType.RAW;
  value: string;
};

export type KeyTranslationValue = BaseTranslationValue & {
  type: TranslationType.KEY_LOOKUP;
  key: string;
  params?: Array<any>;
};

export type ExplicitTranslationValue = BaseTranslationValue & {
  type: TranslationType.EXPLICIT;
  nameEn: string;
  nameDe: string;
};
