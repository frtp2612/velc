import { Translatable } from "@/enums/index";
import { TranslationType } from "@/enums";

export function textFormatter(value: Translatable, translator: any): string {
  switch (value.type) {
    case TranslationType.EXPLICIT:
      return translator.locale.value === "en" ? value.nameEn : value.nameDe;
    case TranslationType.KEY_LOOKUP:
      return translator.t(value.key, value.params || []);
    default:
      break;
  }

  return value.value;
}
