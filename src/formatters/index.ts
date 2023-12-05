import { TranslationType } from "@/enums";
import { Translatable } from "@/enums/index";

export function textFormatter(value: Translatable, translator: any): string {
	let formattedText = "";

	switch (value.type) {
		case TranslationType.EXPLICIT:
			formattedText =
				translator.locale.value === "en" ? value.nameEn : value.nameDe;
			break;
		case TranslationType.KEY_LOOKUP:
			formattedText = translator.t(value.key, value.params || []);
			break;
		default:
			formattedText = value.value;
			break;
	}

	if (value.trailingText) {
		if (typeof value.trailingText === "string") {
			formattedText += " " + value.trailingText;
		} else {
			formattedText += " " + textFormatter(value.trailingText, translator);
		}
	}

	return formattedText;
}
