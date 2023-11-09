import {
	TranslationType,
	type ExplicitTranslationValue,
	type KeyTranslationValue,
	type RawTranslationValue,
} from "@/enums";

export function textFormatter(
	value: {
		type: TranslationType;
		value: ExplicitTranslationValue | KeyTranslationValue | RawTranslationValue;
	},
	translator: any
): string {
	switch (value.type) {
		case TranslationType.EXPLICIT:
			return translator.locale.value === "en"
				? (value.value as ExplicitTranslationValue).nameEn
				: (value.value as ExplicitTranslationValue).nameDe;
		case TranslationType.KEY_LOOKUP:
			return translator.t(
				(value.value as KeyTranslationValue).key,
				(value.value as KeyTranslationValue).params
			);
		default:
			break;
	}

	return value.value as RawTranslationValue;
}
